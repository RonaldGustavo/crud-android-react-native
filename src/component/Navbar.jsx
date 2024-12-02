import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navbarItem}
        onPress={() => navigation.navigate('home')}>
        <Icon name="home" size={24} color="black" />
        <Text style={styles.navbarText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navbarItem}
        onPress={() => navigation.navigate('createTodolist')}>
        <Icon name="create" size={24} color="black" />
        <Text style={styles.navbarText}>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navbarItem}
        onPress={() => navigation.navigate('profile')}>
        <Icon name="person" size={24} color="black" />
        <Text style={styles.navbarText}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'lightblue',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbarText: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default Navbar;
