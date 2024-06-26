import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../app/screens/Dashboard';

const Stack = createStackNavigator();

const InternalNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default InternalNavigator;
