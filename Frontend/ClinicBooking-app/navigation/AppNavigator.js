import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import ScheduleManagementScreen from "../screens/ScheduleManagementScreen";

import AvailableScheduleScreen from "../screens/AvailableScheduleScreen";

const Stack =
  createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ScheduleManagement"
        component={
          ScheduleManagementScreen
        }
      />

      <Stack.Screen
        name="AvailableSchedules"
        component={
          AvailableScheduleScreen
        }
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;