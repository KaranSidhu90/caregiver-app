import React from 'react';
import HomeScreen from '../app/screens/HomeScreen';
import Login from '../app/screens/Login';
import Registration from '../app/screens/Registration';
import CaregiverRegistration from '../app/screens/CaregiverRegistration';
import HomeStackNavigator from '../app/screens/HomeInternal';
import CaregiverProfile from '../app/screens/CaregiverProfile';
import BookVisitScreen from '../app/screens/BookVisitScreen';
import AfterAuthNavigator from './AfterAuthNavigator';
import WithDrawerNavigator from './WithDrawerNavigator';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Sidebar from '../app/components/Sidebar';

const Drawer = createDrawerNavigator();

const AuthNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{headerShown: false, swipeEnabled: false}} drawerContent={(props) => <Sidebar {...props} />}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
      />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Register" component={Registration} />
      <Drawer.Screen name="AfterAuth" component={AfterAuthNavigator} />
    </Drawer.Navigator>
  );
};

export default AuthNavigator;
