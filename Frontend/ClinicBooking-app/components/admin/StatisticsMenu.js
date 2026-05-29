import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import ActionButton from "../common/ActionButton";

const StatisticsMenu = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Thống kê
      </Text>

      <ActionButton title="Thống kê bệnh nhân" onPress={() => navigation.navigate("PatientStats")} />
      <ActionButton title="Thống kê dịch vụ" onPress={() => navigation.navigate("ServiceStats")} />
      <ActionButton title="Thống kê bác sĩ" onPress={() => navigation.navigate("DoctorStats")} />
      <ActionButton title="Thống kê khung giờ" onPress={() => navigation.navigate("TimeSlotStats")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default StatisticsMenu;
