import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity,SafeAreaView  } from 'react-native';

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={require('../assets/Logo.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
logo: {
    width: 400,
    height: 100,
    marginBottom: 15,
    resizeMode: 'contain',
  }
})

export default SplashScreen;