import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getDataDetailTodolistAction} from '../features/todolist/action';
import {formatDate} from '../utils/Date';
import {useQuery} from '@realm/react';
import {TodolistRead} from '../realm/model';
import {GET_DATA_DETAIL_OFFLINE_TODOLIST} from '../constants';

const Card = ({data, onDetail, onDelete}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {connection} = useSelector(state => state.auth);
  const todolistRead = useQuery(TodolistRead);

  console.log('data card', data);
  return (
    <View>
      {data &&
        data.length > 0 &&
        data.map(item => (
          <TouchableOpacity
            key={item._id}
            style={styles.card}
            onPress={() => onDetail(item?._id)}>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>User:</Text> {item?.user}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>ID:</Text> {item?._id}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Activity:</Text> {item?.activity}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Description:</Text>
              {item?.description}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Created At:</Text>
              {formatDate(item.created_at)}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.boldText}>Updated At:</Text>
              {formatDate(item.updated_at)}
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: 'green'}]}
                onPress={async () => {
                  if (connection === true) {
                    await dispatch(getDataDetailTodolistAction(item._id));
                    navigation.navigate('updateTodolist');
                  } else {
                    const findDetail = todolistRead.find(
                      dataFind => dataFind._id === item._id,
                    );

                    // check data
                    console.log('data detail offline', findDetail);

                    dispatch({
                      type: GET_DATA_DETAIL_OFFLINE_TODOLIST,
                      payload: {
                        dataDetailOffline: findDetail,
                      },
                    });
                    if (findDetail) {
                      navigation.navigate('updateTodolist');
                    } else {
                      Alert.alert('Error', `Data Detail not found`, [
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                      ]);
                    }
                  }
                }}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: 'blue'}]}
                onPress={() => onDelete(item)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default Card;
