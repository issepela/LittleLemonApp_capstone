import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './components/Onboarding';
import Profile from './components/Profile';
import SplashScreen from './components/SplashScreen';
import Home from './components/Home';

const Stack = createNativeStackNavigator();

function RootStack({ isOnboardingComplete }) {
  return (
    <Stack.Navigator initialRouteName={isOnboardingComplete ? 'Home' : 'Onboarding'}>
        <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = React.useState(null);

  React.useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('user_data');
        if (value) {
          const userData = JSON.parse(value);
          if (userData.firstName && userData.email) {
            setIsOnboardingComplete(true);
          } else {
            setIsOnboardingComplete(false);
          }
        } else {
          setIsOnboardingComplete(false);
        }
      } catch (e) {
        console.error('Failed to load onboarding status', e);
      } finally {
      setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (isLoading) {
    return (
      <SplashScreen />
    );
  }

  return (
    <NavigationContainer>
      <RootStack isOnboardingComplete={isOnboardingComplete} />
    </NavigationContainer>
  );
}
