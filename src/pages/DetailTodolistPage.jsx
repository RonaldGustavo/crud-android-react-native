import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {formatDate} from '../utils/Date';
import Navbar from '../component/Navbar';

const DetailTodolistPage = ({navigation}) => {
  const [dataStateDetail, setDataStateDetail] = useState({});

  const {dataDetail, dataDetailOffline} = useSelector(state => state.todolist);
  const {connection} = useSelector(state => state.auth);

  console.log('data detail masuk', dataStateDetail);

  useEffect(() => {
    if (connection === true) {
      setDataStateDetail(dataDetail);
    } else {
      setDataStateDetail(dataDetailOffline);
    }
  }, [dataDetail, dataDetailOffline, connection]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>ID:</Text>
          <Text>{dataStateDetail._id}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Activity:</Text>
          <Text>{dataStateDetail.activity}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Description:</Text>
          <Text>{dataStateDetail.description}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Created At:</Text>
          <Text>{formatDate(dataStateDetail.created_at)}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Updated At:</Text>
          <Text>{formatDate(dataStateDetail.updated_at)}</Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('home')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <Navbar />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
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

export default DetailTodolistPage;
