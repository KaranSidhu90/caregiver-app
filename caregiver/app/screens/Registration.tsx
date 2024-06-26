import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationStep1 from './../components/RegistrationStep1';
import RegistrationStep2 from './../components/RegistrationStep2';
import RegistrationStep3 from './../components/RegistrationStep3';
import RegistrationStep4 from './../components/RegistrationStep4';
import RegistrationStep5 from './../components/RegistrationStep5';
import StatusScreen from './StatusScreen';
import Dashboard from '../screens/Dashboard';

const Stack = createStackNavigator();

const RegistrationWizard = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RegistrationStep1" component={RegistrationStep1} />
      <Stack.Screen name="RegistrationStep2" component={RegistrationStep2} />
      <Stack.Screen name="RegistrationStep3" component={RegistrationStep3} />
      <Stack.Screen name="RegistrationStep4" component={RegistrationStep4} />
      <Stack.Screen name="RegistrationStep5" component={RegistrationStep5} />
      <Stack.Screen
        name="StatusScreen"
        component={StatusScreen}
        initialParams={{ status: 'success', title: 'Account Created!', message: 'Your account has been created successfully.', duration:5000, onContinue: () => {} }}
      />
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default RegistrationWizard;
