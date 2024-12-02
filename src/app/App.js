import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import {applyMiddleware, compose, legacy_createStore} from 'redux';
import reducer from '../config/reducer';
import {thunk} from 'redux-thunk';
import {Provider} from 'react-redux';
import DetailTodolistPage from '../pages/DetailTodolistPage';
import CreateTodolistPage from '../pages/CreateTodolistPage';
import UpdateTodolistPage from '../pages/UpdateTodolistPage';

import messaging from '@react-native-firebase/messaging';
import ProfilePage from '../pages/ProfilePage';
import {RealmProvider} from '@realm/react';
import {
  TodolistCreate,
  TodolistDelete,
  TodolistRead,
  ToodlistUpdate,
} from '../realm/model';

function App() {
  // get permission
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    } else {
      console.log('error');
    }
  }

  useEffect(() => {
    requestUserPermission();
  }, []);

  const Stack = createNativeStackNavigator();

  const store = legacy_createStore(reducer, compose(applyMiddleware(thunk)));
  return (
    <RealmProvider
      schema={[TodolistCreate, TodolistRead, ToodlistUpdate, TodolistDelete]}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="login"
              options={{title: 'Login'}}
              component={LoginPage}
            />
            <Stack.Screen
              name="home"
              component={HomePage}
              options={{title: 'Home'}}
            />
            <Stack.Screen
              name="detailTodolist"
              component={DetailTodolistPage}
              options={{title: 'Detail todolist'}}
            />
            <Stack.Screen
              name="createTodolist"
              component={CreateTodolistPage}
              options={{title: 'Create todolist'}}
            />
            <Stack.Screen
              name="updateTodolist"
              component={UpdateTodolistPage}
              options={{title: 'Update todolist'}}
            />
            <Stack.Screen
              name="profile"
              component={ProfilePage}
              options={{title: 'Account'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </RealmProvider>
  );
}

export default App;
