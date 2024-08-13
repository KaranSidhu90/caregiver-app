import React, { useEffect } from 'react';
import HomeScreen from '../app/screens/HomeScreen';
import Login from '../app/screens/Login';
import Registration from '../app/screens/Registration';
import AfterAuthNavigator from './AfterAuthNavigator';
import CaregiverNavigator from './CaregiverNavigator';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SeniorSidebar from '../app/components/SeniorSidebar';  
import CaregiverSidebar from '../app/components/CaregiverSidebar';
import { useUserContext } from '../app/providers/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CaregiverRegister from '../app/screens/CaregiverRegistration';

const Drawer = createDrawerNavigator();

const AuthNavigator: React.FC = () => {
  const { userType, setUserType } = useUserContext();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const storedUserType = await AsyncStorage.getItem('userType');
        setUserType(storedUserType);
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };

    fetchUserType();
  }, []);

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, swipeEnabled: false }}
      drawerContent={(props) =>
        userType === 'Caregiver' ? <CaregiverSidebar {...props} /> : <SeniorSidebar {...props} />
      }
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Register" component={Registration} />
      <Drawer.Screen name="AfterAuth" component={AfterAuthNavigator} />
      <Drawer.Screen name="CaregiverFlow" component={CaregiverNavigator} />
      <Drawer.Screen name='CaregiverRegister' component={CaregiverRegister} />
    </Drawer.Navigator>
  );
};

export default AuthNavigator;
