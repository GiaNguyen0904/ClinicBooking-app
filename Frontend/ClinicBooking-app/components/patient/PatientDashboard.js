import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import ActionButton from "../common/ActionButton";

const PatientDashboard = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Trang khách hàng
      </Text>

      <ActionButton
        title="Đặt lịch khám"
        onPress={() => navigation.navigate("BookAppointment")}
      />

      <ActionButton
        title="Xem khung giờ trống"
        onPress={() => navigation.navigate("AvailableSchedules")}
      />

      <ActionButton
        title="Theo dõi lịch hẹn"
        onPress={() => navigation.navigate("MyAppointments")}
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

export default PatientDashboard;
