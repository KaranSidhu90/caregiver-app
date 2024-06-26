import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../app/screens/HomeScreen';
import Login from '../app/screens/Login';
import Registration from '../app/screens/Registration';
import CaregiverRegistration from '../app/screens/CaregiverRegistration';
import HomeStackNavigator from '../app/screens/HomeInternal';
import CaregiverProfile from '../app/screens/CaregiverProfile';
import BookVisitScreen from '../app/screens/BookVisitScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={Login}
        options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Registration}
        options={{ headerShown: false }} />
      <Stack.Screen name="CaregiverRegister" component={CaregiverRegistration} />
      <Stack.Screen name="HomeInternal" component={HomeStackNavigator} options={{ headerShown: false}} />
      <Stack.Screen name="Profile" component={CaregiverProfile} options={{headerBackTitle: ''}}/>
      <Stack.Screen name="BookVisitScreen" component={BookVisitScreen} options={{headerBackTitle: ''}} />
    
    </Stack.Navigator>
  );
};

export default AuthNavigator;
