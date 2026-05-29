import React from "react";

import {
  View,
  Button,
} from "react-native";

import ScheduleList from "../../components/schedule/ScheduleList";

const ScheduleManagementScreen = ({
  navigation,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Xem khung giờ trống"
        onPress={() =>
          navigation.navigate(
            "AvailableSchedules"
          )
        }
      />

      <ScheduleList />
    </View>
  );
};

export default ScheduleManagementScreen;