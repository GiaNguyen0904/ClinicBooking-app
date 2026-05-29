import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import ActionButton from "../common/ActionButton";

const AdminDashboard = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Trang quản lý phòng khám
      </Text>

      <ActionButton
        title="Quản lý tài khoản bác sĩ"
        onPress={() => navigation.navigate("DoctorAccounts")}
      />

      <ActionButton
        title="Quản lý khung giờ"
        onPress={() => navigation.navigate("ScheduleManagement")}
      />

      <ActionButton
        title="Quản lý lịch hẹn"
        onPress={() => navigation.navigate("AppointmentManagement")}
      />

      <ActionButton
        title="Thống kê"
        onPress={() => navigation.navigate("Statistics")}
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
    marginBottom: 24,
  },
});

export default AdminDashboard;
