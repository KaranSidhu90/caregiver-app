import React from "react";
import HomeStackNavigator from "../app/screens/HomeInternal";
import CaregiverProfile from "../app/screens/CaregiverProfile";
import BookVisitScreen from "../app/screens/BookVisitScreen";
import AllCaregivers from "../app/screens/AllCaregivers"; 
import BookingsScreen from '../app/screens/BookingsScreen';
import BookingAgendaScreen from '../app/screens/BookingAgendaScreen';
import { createStackNavigator } from "@react-navigation/stack";
import CaregiverRegister from "../app/screens/CaregiverRegistration";
import RatingScreen from '../app/screens/RatingScreen';
import StatusScreen from "../app/screens/StatusScreen";

const Stack = createStackNavigator();

const AfterAuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeInternal"
        component={HomeStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="StatusScreen" component={StatusScreen} />

      <Stack.Screen
        name="CaregiverRegister"
        component={CaregiverRegister}
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
      <Stack.Screen
        name="RatingScreen"
        component={RatingScreen}
        options={{ headerBackTitle: "", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AfterAuthNavigator;
