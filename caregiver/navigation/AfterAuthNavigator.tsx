// AfterAuthNavigator.tsx
import React from "react";
import CaregiverRegistration from "../app/screens/CaregiverRegistration";
import HomeStackNavigator from "../app/screens/HomeInternal";
import CaregiverProfile from "../app/screens/CaregiverProfile";
import BookVisitScreen from "../app/screens/BookVisitScreen";
import AllCaregivers from "../app/screens/AllCaregivers"; 
import BookingsScreen from '../app/screens/BookingsScreen';
import BookingAgendaScreen from '../app/screens/BookingAgendaScreen';
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const AfterAuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeInternal"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CaregiverRegister"
        component={CaregiverRegistration}
      />
      <Stack.Screen
        name="Profile"
        component={CaregiverProfile}
        options={{ headerBackTitle: "" }}
      />
      <Stack.Screen
        name="BookVisitScreen"
        component={BookVisitScreen}
        options={{ headerBackTitle: "" }}
      />
      <Stack.Screen
        name="All Caregivers"
        component={AllCaregivers}  
        options={{ headerBackTitle: "" }}
      />
      <Stack.Screen
        name="Bookings" 
        component={BookingsScreen} 
        options={{ headerBackTitle: "" }}
      />
      <Stack.Screen
        name="Booking Agenda" 
        component={BookingAgendaScreen} 
        options={{ headerBackTitle: "" }}
      />
    </Stack.Navigator>
  );
};

export default AfterAuthNavigator;
