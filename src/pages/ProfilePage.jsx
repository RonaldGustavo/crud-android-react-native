import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import Navbar from '../component/Navbar';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import {useRealm} from '@realm/react';
import {TodolistRead} from '../realm/model';

const ProfilePage = () => {
  const {dataUser} = useSelector(state => state.auth);

  const realm = useRealm();

  const navigation = useNavigation();
  const handleLogout = () => {
    realm.write(() => {
      realm.delete(realm.objects(TodolistRead));
    });
    Alert.alert(
      'Success',
      'Logout Success!',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
    navigation.navigate('login');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.headerProfile}>
            <Icon name="person" size={32} color="#3498db" />
            <Text style={styles.profileTitle}>Profile</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{dataUser.username}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Password:</Text>
            <Text style={styles.value}>{dataUser.password}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Navbar />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#2c3e50',
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#7f8c8d',
  },
  value: {
    flex: 1,
    color: '#2c3e50',
  },
  logoutButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilePage;
