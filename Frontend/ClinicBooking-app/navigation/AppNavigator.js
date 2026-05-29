import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import ScheduleManagementScreen from "../screens/schedule/ScheduleManagementScreen";

import AvailableScheduleScreen from "../screens/schedule/AvailableScheduleScreen";

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