import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CaregiverDashboard from "../app/screens/CaregiverDashboard";

const Stack = createStackNavigator();

const CaregiverNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CaregiverDashboard"
        component={CaregiverDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default CaregiverNavigator;
