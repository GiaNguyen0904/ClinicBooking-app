import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import ActionButton from "../common/ActionButton";

const DoctorDashboard = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Trang bác sĩ
      </Text>

      <ActionButton
        title="Quản lý bệnh án"
        onPress={() => {}}
      />

      <ActionButton
        title="Xem lịch làm việc"
        onPress={() => navigation.navigate("ScheduleManagement")}
      />

      <ActionButton
        title="Đăng xuất"
        variant="danger"
        onPress={() => navigation.replace("Login")}
      />
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

export default DoctorDashboard;
