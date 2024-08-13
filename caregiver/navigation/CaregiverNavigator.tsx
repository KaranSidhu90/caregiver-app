import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CaregiverDashboard from "../app/screens/CaregiverDashboard";
import RequestDetailScreen from "../app/screens/RequestDetailScreen";  

const Stack = createStackNavigator();

const CaregiverNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CaregiverDashboard"
        component={CaregiverDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RequestDetailScreen"  // Add the new screen to the stack
        component={RequestDetailScreen}
        options={{ headerShown: true, title: 'Request Details' }}
      />
    </Stack.Navigator>
  );
};

export default CaregiverNavigator;
