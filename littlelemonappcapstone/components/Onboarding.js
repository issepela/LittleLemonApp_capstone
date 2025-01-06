import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity,SafeAreaView, Alert  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { useNavigation } from '@react-navigation/native';

const Onboarding = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const validateFirstName = (name) => {
    return /^[A-Za-z]+$/.test(name);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = validateFirstName(firstName) && validateEmail(email);
  

  const handleOnboarding = async () => {
    try {
      const userData = { firstName, email };
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      //Alert.alert('Success', 'Your data has been saved!');
    } catch (error) {
      //Alert.alert('Error', 'Failed to save data');
    }
    navigation.navigate('Profile')
  };

  return (
    
    <View style={styles.container}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} />
      <View style={styles.header}>
      </View>

      <Text style={styles.subtitle}>Let us get to know you</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        disabled={!isFormValid}
        onPress={handleOnboarding}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFEE',
    alignItems: 'center',
    marginTop: 50,
    padding: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#495E57',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '60%',
  },
  buttonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Onboarding;
