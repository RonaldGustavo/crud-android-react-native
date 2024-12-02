import React, {useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {createTodoListService} from '../features/todolist/service';
import {useDispatch, useSelector} from 'react-redux';
import {getDataTodolistAction} from '../features/todolist/action';
import Navbar from '../component/Navbar';
import {useRealm} from '@realm/react';
import {TodolistCreate} from '../realm/model';
import {sendNotifFirebase} from '../features/auth/service';

const CreateTodolistPage = ({navigation}) => {
  // selector redux
  const {curPage, limit, keyword} = useSelector(state => state.todolist);
  const {dataUser, connection, token} = useSelector(state => state.auth);

  const [activity, setActivity] = useState('');
  const [description, setDescription] = useState('');

  const realm = useRealm();

  const dispatch = useDispatch();

  const handleCreateTodolist = async () => {
    const bodyCreate = [
      {
        user: dataUser.username,
        activity: activity,
        description: description,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    if (!activity || !description) {
      Alert.alert(
        'Error',
        'Please fill in both activity and description fields.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    }
    const randomnId = Math.floor(Math.random() * 999) + new Date();

    // no internet
    if (!connection) {
      realm.write(() => {
        realm.create(TodolistCreate, {
          _id: `id${randomnId}`,
          user: dataUser.username,
          activity: activity,
          description: description,
          created_at: new Date(),
          updated_at: new Date(),
        });
        Alert.alert(
          'info',
          'success insert mode offline',
          [{text: 'OK', onPress: () => console.log('pressed sync')}],
          {cancelable: false},
        );
        navigation.navigate('home');
      });
    } else {
      // ada internet
      const response = await createTodoListService(bodyCreate);
      if (response.status === 200) {
        try {
          const sendFirebase = sendNotifFirebase(token, 'create-todolist');
          console.log('firebase create berhasil', sendFirebase);
        } catch (error) {
          Alert.alert(
            'error',
            `gagal send notif firebase ${error.message}`,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }

        // after create sync data
        dispatch(
          getDataTodolistAction(curPage, limit, keyword, dataUser.username),
        );
        navigation.navigate('home');
      } else {
        // error service api create
        Alert.alert(
          'Error',
          `${response.message}`,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        {/* Date Input (Disabled) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Created At:</Text>
          <TextInput
            style={styles.input}
            placeholder={new Date().toISOString().slice(0, 10)}
            editable={false}
          />
        </View>

        {/* Activity Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Activity:</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your activity"
            onChangeText={text => setActivity(text)}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            multiline
            placeholder="Type your description"
            onChangeText={text => setDescription(text)}
          />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleCreateTodolist}>
          <Text style={styles.buttonText}>Submit</Text>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default CreateTodolistPage;
