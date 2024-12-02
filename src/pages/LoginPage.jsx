import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {dataUser} from '../data/DataUser';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {addEventListener} from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';

import {DATA_USER, GET_TOKEN, IS_CONNECTED} from '../constants';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  // get connection from redux
  const {connection} = useSelector(state => state.auth);

  // check login user
  const findUser = dataUser.find(
    data =>
      data.username.toLowerCase() === username.toLowerCase() &&
      data.password === password,
  );

  // get token
  async function getToken() {
    const tokenFCM = await messaging()
      .getToken({
        vapidKey:
          'BLUWzld_w4ej3nOso9X7Tp89V4Z4AGiXIHjie944UT1D8m3Li3sicyNb-1SNq0ksr40BLYxuiDAzO5WEiZ40eNA',
      })
      .then(res => {
        console.log('token', res);
        dispatch({
          type: GET_TOKEN,
          payload: {
            token: res,
          },
        });
      });

    return tokenFCM;
  }

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    // Function to handle connection change
    const handleConnectionChange = state => {
      dispatch({
        type: IS_CONNECTED,
        payload: {
          connection: state.isConnected,
        },
      });
    };
    // Subscribe to NetInfo events
    const unsubscribe = addEventListener(handleConnectionChange);

    // Clean up subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    Alert.alert(
      'Info Internet',
      connection ? 'Anda mode Online!' : 'Anda mode Offline!',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }, [connection]);

  const handleLogin = () => {
    if (findUser) {
      dispatch({
        type: DATA_USER,
        payload: {
          dataUser: findUser,
        },
      });

      Alert.alert(
        'Success',
        'login Success!',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      setUsername('');
      setPassword('');

      navigation.navigate('home');

      console.log('Login Successfull');
    } else {
      Alert.alert(
        'Failed',
        'login failed!',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      console.log('Please enter both username and password');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo_dbo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginLeft: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
});

export default LoginPage;
