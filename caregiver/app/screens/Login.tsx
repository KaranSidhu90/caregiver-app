import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginComponent from '../components/LoginComponent';

const Stack = createStackNavigator();

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginComponent" component={LoginComponent} />
    </Stack.Navigator>
  );
};

export default LoginStackNavigator;
