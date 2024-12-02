import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {updateTodoListService} from '../features/todolist/service';
import {useDispatch, useSelector} from 'react-redux';
import {getDataTodolistAction} from '../features/todolist/action';
import {formatDate} from '../utils/Date';
import Navbar from '../component/Navbar';
import {useQuery, useRealm} from '@realm/react';
import {ToodlistUpdate} from '../realm/model';
import {sendNotifFirebase} from '../features/auth/service';

const UpdateTodolistPage = ({navigation}) => {
  const [activity, setActivity] = useState('');
  const [description, setDescription] = useState('');
  const [dataStateDetail, setDataStateDetail] = useState({});
  const dispatch = useDispatch();

  const realm = useRealm();
  const todolistUpdate = useQuery(ToodlistUpdate);

  const {dataDetail, dataDetailOffline, curPage, limit, keyword} = useSelector(
    state => state.todolist,
  );

  const {dataUser, connection, token} = useSelector(state => state.auth);

  useEffect(() => {
    if (connection === true) {
      setDataStateDetail(dataDetail);
    } else {
      setDataStateDetail(dataDetailOffline);
    }
  }, [dataDetail, dataDetailOffline, connection]);

  const handleUpdate = async () => {
    const bodyUpdate = {
      user: dataUser.username,
      activity: activity || dataStateDetail.activity,
      description: description || dataStateDetail.description,
      created_at: dataStateDetail.created_at,
      updated_at: new Date(),
    };

    // no internet
    if (!connection) {
      // check id tersebut sudah di update belum sebelumnya di realm
      if (todolistUpdate.some(item => item._id === dataStateDetail._id)) {
        const deleteDataFilterUser = realm
          .objects('TodolistUpdate')
          .filtered(`_id == "${dataStateDetail._id}"`);
        realm.write(async () => {
          await realm.delete(deleteDataFilterUser);
        });
        realm.write(() => {
          realm.create(ToodlistUpdate, {
            _id: `${dataStateDetail._id}`,
            user: dataUser.username,
            activity: activity ? activity : dataStateDetail.activity,
            description: description
              ? description
              : dataStateDetail.description,
            created_at: dataStateDetail.created_at,
            updated_at: new Date(),
          });
        });
        console.log('update realm dengan data sudah ada berhasil');
        Alert.alert(
          'info',
          'success update mode offline',
          [{text: 'OK', onPress: () => console.log('pressed update')}],
          {cancelable: false},
        );
        navigation.navigate('home');
      } else {
        // update realm dengan data belum ada di realm
        realm.write(() => {
          realm.create(ToodlistUpdate, {
            _id: `${dataStateDetail._id}`,
            user: dataUser.username,
            activity: activity,
            description: description,
            created_at: new Date(),
            updated_at: new Date(),
          });
          Alert.alert(
            'info',
            'success update mode offline',
            [{text: 'OK', onPress: () => console.log('pressed update')}],
            {cancelable: false},
          );
          navigation.navigate('home');
        });
      }
    } else {
      // have internet
      const response = await updateTodoListService(
        bodyUpdate,
        dataStateDetail._id,
      );
      if (response.status === 200) {
        try {
          const sendFirebase = await sendNotifFirebase(
            token,
            'update-todolist',
          );
          console.log('firebase update berhasil', sendFirebase);
        } catch (error) {
          // firebase error
          Alert.alert(
            'error',
            `gagal send notif firebase ${error.message}`,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }

        // after update sync data
        dispatch(
          getDataTodolistAction(curPage, limit, keyword, dataUser.username),
        );

        navigation.navigate('home');
      } else {
        // error service api update
        Alert.alert(
          'Error',
          `${response.message}`,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      }
    }

    dispatch(getDataTodolistAction(curPage, limit, keyword, dataUser.username));
    navigation.navigate('home');
  };
  return (
    <>
      <View style={styles.container}>
        {/* Date Input (Disabled) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Created At:</Text>
          <TextInput
            style={styles.input}
            placeholder={formatDate(dataStateDetail.created_at)}
            editable={false}
          />
        </View>

        {/* Activity Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Activity:</Text>
          <TextInput
            style={styles.input}
            placeholder={dataStateDetail.activity}
            onChangeText={text => setActivity(text)}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            multiline
            placeholder={dataStateDetail.description}
            onChangeText={text => setDescription(text)}
          />
        </View>

        <TouchableOpacity style={styles.backButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
      <Navbar />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UpdateTodolistPage;
