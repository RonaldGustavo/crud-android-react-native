import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  getDataDetailTodolistAction,
  getDataTodolistAction,
} from '../features/todolist/action';
import {
  createTodoListService,
  deleteTodoListService,
  updateTodoListService,
} from '../features/todolist/service';
import {CHANGE_LIMIT, GET_DATA_DETAIL_OFFLINE_TODOLIST} from '../constants';

import messaging from '@react-native-firebase/messaging';
import Navbar from '../component/Navbar';
import {useNavigation} from '@react-navigation/native';
import Card from '../component/Card';
import {useQuery, useRealm} from '@realm/react';
import {
  TodolistCreate,
  TodolistDelete,
  TodolistRead,
  ToodlistUpdate,
} from '../realm/model';
import {sendNotifFirebase} from '../features/auth/service';

const HomePage = () => {
  const {data, pagination, curPage, limit, keyword} = useSelector(
    state => state.todolist,
  );

  const {dataUser, connection, token} = useSelector(state => state.auth);
  const [page, setPage] = useState(curPage || 1);
  const [perpage, setPerpage] = useState(limit || 5);
  const [query, setQuery] = useState(keyword);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  // test connection
  console.log('connection', connection);

  // realm
  const realm = useRealm();
  const todolistCreate = useQuery(TodolistCreate);
  const todolistRead = useQuery(TodolistRead);
  const todolistUpdate = useQuery(ToodlistUpdate);
  const todolistDelete = useQuery(TodolistDelete);

  console.log('data create offline', todolistCreate);
  console.log('data read offline', todolistRead);
  console.log('data redux online', data);
  console.log('data realm update', todolistUpdate);
  console.log('data realm delete', todolistDelete);

  useEffect(() => {
    dispatch(getDataTodolistAction(page, perpage, query, dataUser.username));
  }, [dispatch, page, perpage, query, dataUser, realm, connection]);

  const formatCreateData = todolistCreate.map(item => ({
    user: item.user,
    activity: item.activity,
    description: item.description,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
  console.log('format create data', formatCreateData);

  const findUser = formatCreateData.filter(
    user => user.user === dataUser.username,
  );
  // console.log('find user filter data offline', findUser);

  // sync data offline to online
  useEffect(() => {
    if (connection === true) {
      realm.write(() => {
        realm.delete(realm.objects(TodolistRead));
      });
      realm.write(() => {
        data &&
          data.forEach(item => {
            const existingObject = realm.objectForPrimaryKey(
              TodolistRead,
              item._id,
            );
            if (existingObject) {
              // Objek sudah ada, pertimbangkan untuk memperbarui atau abaikan
              console.log(`Objek dengan _id ${item._id} sudah ada.`);
            } else {
              // Objek belum ada, buat objek baru
              realm.create(TodolistRead, item);
            }
          });
      });
    }
  }, [connection, data, realm]);

  // call firebase in background / saat aplikasi mati
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Success Create background!', remoteMessage.notification.title);
  });

  // call firebase in app / saat aplikasi nyala
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      switch (remoteMessage.notification.title) {
        case 'update-todolist':
          Alert.alert(
            'Success Updated from Firebase!',
            `Success Update data Activity`,
          );
          break;
        case 'create-todolist':
          Alert.alert(
            'Success Created from Firebase!',
            `Success create data Activity`,
          );
          break;
        case 'delete-todolist':
          Alert.alert('Success Deleted from Firebase!', `success delete data!`);
          break;
      }
    });

    return unsubscribe;
  }, []);

  const handleDetail = async id => {
    if (connection === true) {
      await dispatch(getDataDetailTodolistAction(id));
      navigation.navigate('detailTodolist');
    } else {
      const findDetail = todolistRead.find(item => item._id === id);

      // check data
      console.log('data detail offline', findDetail);

      dispatch({
        type: GET_DATA_DETAIL_OFFLINE_TODOLIST,
        payload: {
          dataDetailOffline: findDetail,
        },
      });

      if (findDetail) {
        navigation.navigate('detailTodolist');
      } else {
        Alert.alert('Error', `Data Detail not found`, [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
    }
  };

  const handleSyncData = async () => {
    if (
      findUser.length > 0 ||
      todolistUpdate.length > 0 ||
      todolistDelete.length > 0
    ) {
      try {
        console.log('data find user', findUser);

        // create
        if (formatCreateData) {
          try {
            await createTodoListService(findUser);
            dispatch(
              getDataTodolistAction(curPage, limit, keyword, dataUser.username),
            );
          } catch (error) {
            Alert.alert(
              'info',
              'gagal Create data...',
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
          }
        }

        // -----

        //update
        if (todolistUpdate) {
          try {
            // Temukan objek di realm berdasarkan ID
            const filteredData = todolistUpdate.filter(item => {
              return data.some(utamaItem => utamaItem._id === item._id);
            });

            if (filteredData.length > 0) {
              // Kirim permintaan update ke API untuk setiap data yang cocok
              const updatePromises = filteredData.map(async item => {
                const response = await updateTodoListService(item, item._id);
                return response;
              });

              // Tunggu semua permintaan update selesai
              await Promise.all(updatePromises);

              dispatch(
                getDataTodolistAction(
                  curPage,
                  limit,
                  keyword,
                  dataUser.username,
                ),
              );
            }
          } catch (error) {
            Alert.alert(
              'info',
              'gagal Update data...',
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
          }
        }

        // ----

        // delete
        if (todolistDelete) {
          try {
            const filterDelete = todolistDelete.filter(item => {
              return data.some(utamaItem => utamaItem._id === item._id);
            });

            if (filterDelete.length > 0) {
              // Kirim permintaan update ke API untuk setiap data yang cocok
              const deletePromise = filterDelete.map(async item => {
                const response = await deleteTodoListService(item._id);
                return response;
              });

              // Tunggu semua permintaan update selesai
              await Promise.all(deletePromise);

              dispatch(
                getDataTodolistAction(
                  curPage,
                  limit,
                  keyword,
                  dataUser.username,
                ),
              );
            }
          } catch (error) {
            Alert.alert(
              'info',
              'gagal Delete data...',
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
          }
        }

        Alert.alert(
          'info',
          'Berhasil Sync Data...',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );

        const deleteDataFilterUser = realm
          .objects('TodolistCreate')
          .filtered(`user == "${dataUser.username}"`);

        realm.write(() => {
          realm.delete(deleteDataFilterUser);
        });

        realm.write(() => {
          realm.delete(realm.objects(TodolistDelete));
        });

        realm.write(() => {
          realm.delete(realm.objects(ToodlistUpdate));
        });
      } catch (error) {
        Alert.alert(
          'error',
          'gagal sync error service...',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      }
    } else {
      Alert.alert(
        'info',
        'Nothing to Sync...',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  const handleDelete = async item => {
    // jika online
    if (connection === true) {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to delete?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              const response = await deleteTodoListService(item._id);

              if (response.status === 200) {
                const sendFirebase = await sendNotifFirebase(
                  token,
                  'delete-todolist',
                );

                console.log('firebase delete berhasil', sendFirebase);

                try {
                } catch (error) {
                  Alert.alert(
                    'error',
                    `gagal send notif firebase ${error.message}`,
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                    {cancelable: false},
                  );
                }
              }

              //after delete sync data
              dispatch(
                getDataTodolistAction(page, perpage, query, dataUser.username),
              );
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      // offline

      try {
        // check data sudah didelete belum di realm
        if (todolistDelete.some(todolist => todolist._id === item._id)) {
          Alert.alert(
            'info',
            'Tidak dapat delete data, karena sudah didelete sebelumnya',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        } else {
          realm.write(() => {
            realm.create(TodolistDelete, {
              _id: `${item._id}`,
              user: dataUser.username,
            });
          });
          Alert.alert(
            'info',
            'Success Delete data offline mode',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }
      } catch (error) {
        Alert.alert(
          'info',
          'Gagal Delete data offline mode',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      }
    }
  };

  const loadMore = () => {
    setPerpage(perpage + 10);
    dispatch({
      type: CHANGE_LIMIT,
      payload: {
        limit: perpage + 10,
      },
    });
  };

  const handleLoadMorePress = () => {
    if (pagination && pagination.total >= perpage) {
      loadMore();
    } else {
      console.log('No more data to load.');
    }
  };

  // count data sync
  const filteredCreateData = findUser.filter(
    item => item.user === dataUser.username,
  );
  const filteredUpdateData = todolistUpdate.filter(
    item => item.user === dataUser.username,
  );
  const filteredDeleteData = todolistDelete.filter(
    item => item.user === dataUser.username,
  );

  return (
    <>
      <View style={styles.container}>
        <View>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <TouchableOpacity style={[styles.button]}>
              {/* <Button
                title="delete"
                onPress={() => {
                  realm.write(() => {
                    realm.delete(realm.objects(TodolistDelete));
                  });
                }}
              /> */}
              <Button
                title="Sync Data"
                onPress={handleSyncData}
                disabled={
                  connection === false ||
                  (filteredCreateData.length === 0 &&
                    findUser.length === 0 &&
                    filteredUpdateData.length === 0 &&
                    filteredDeleteData.length === 0)
                }
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
              }}>
              <Text>
                create: {filteredCreateData.length}, update:{' '}
                {filteredUpdateData.length}, delete: {filteredDeleteData.length}{' '}
                to sync
              </Text>
            </View>
          </View>
          <ScrollView>
            {connection === true ? (
              <Card
                data={data}
                onDetail={handleDetail}
                onDelete={handleDelete}
              />
            ) : (
              <Card
                data={todolistRead}
                onDetail={handleDetail}
                onDelete={handleDelete}
              />
            )}
            <View style={styles.loadMoreContainer}>
              <Button
                title="Load More"
                onPress={handleLoadMorePress}
                disabled={
                  (pagination && pagination.total < perpage) ||
                  connection === false
                }
              />
            </View>
          </ScrollView>
        </View>
      </View>
      <Navbar />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  loadMoreContainer: {
    marginTop: 20,
    marginBottom: 130,
  },
});

export default HomePage;
