import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaskedTextInput } from "react-native-mask-text";

export default function Profile({navigation}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [notifications, setNotifications] = useState({
    OrderStatuses: true,
    PasswordChanges: true,
    SpecialOffers: true,
    Newsletter: true,
  });

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setFirstName(parsedData.firstName || '');
        setEmail(parsedData.email || '');
        setAvatar(parsedData.avatar || '');
        setLastName(parsedData.lastName || '')
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const saveChanges = async () => {
    const updatedData = {
      firstName,
      lastName,
      email,
      phone,
      avatar,
      notifications,
    };
    await AsyncStorage.setItem('user_data', JSON.stringify(updatedData));
    Alert.alert('Success', 'Changes saved successfully!');
  };

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Onboarding')
  };

  const gohome = async () => {
        navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={gohome}
          style={styles.roundButton1}>
         <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarTop} />
          ) : (
            <Text style={styles.roundButton1}>{firstName[0]}{lastName[0]?(lastName[0]):("")}</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Personal Information</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        editable={false}
        style={[styles.input, { backgroundColor: '#EDEFEE' }]}
      />
      <MaskedTextInput
        mask="(999) 999-9999"
        inputMode="numeric"
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <Text style={styles.subHeader}>Email Notifications</Text>
      {Object.keys(notifications).map((key) => (
        <View key={key} style={styles.switchContainer}>
          <Text>{key.replace(/([A-Z])/g, ' $1')}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#495E57' }}  
            value={notifications[key]}
            onValueChange={(value) =>
              setNotifications({ ...notifications, [key]: value })
            }
          />
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#EDEFEE',
  },
  topBar: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 40,
  },
  header: {
    fontSize: 32,
    fontFamily: 'MarkaziText-Medium',
    color: '#495E57',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 22,
    fontFamily: 'Karla-Regular',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#495E57',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    fontFamily: 'Karla-Regular',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#F4CE14',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
  },
  saveText: {
    color: '#333333',
    fontSize: 18,
    fontFamily: 'Karla-Regular',
  },
  logoutButton: {
    backgroundColor: '#495E57',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Karla-Regular',
  },
  avatarTop: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  roundButton1: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#495E57',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'semibold',
  },
});
