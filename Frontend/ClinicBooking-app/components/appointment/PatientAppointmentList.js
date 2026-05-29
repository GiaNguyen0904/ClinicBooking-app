import React, {
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchPatientAppointments,
  cancelAppointmentThunk,
} from "../../redux/appointmentSlice";

import TextField from "../common/TextField";
import ActionButton from "../common/ActionButton";
import AppointmentCard from "./AppointmentCard";

const PatientAppointmentList = () => {
  const dispatch = useDispatch();

  const {
    patientAppointments,
    loading,
    error,
    message,
  } = useSelector(
    (state) => state.appointment
  );

  const {
    user,
  } = useSelector(
    (state) => state.clinic
  );

  const [patientId, setPatientId] =
    useState(
      user?.MaBenhNhan
        ? user.MaBenhNhan.toString()
        : ""
    );

  const handleLoad = () => {
    if (!patientId) {
      Alert.alert(
        "Thiếu thông tin",
        "Nhập mã bệnh nhân trước"
      );

      return;
    }

    dispatch(
      fetchPatientAppointments(
        Number(patientId)
      )
    );
  };

  const handleCancel = async (id) => {
    try {
      await dispatch(
        cancelAppointmentThunk(id)
      ).unwrap();

      dispatch(
        fetchPatientAppointments(
          Number(patientId)
        )
      );
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err || "Không thể hủy lịch"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Lịch hẹn của tôi
      </Text>

      <TextField
        label="Mã bệnh nhân"
        placeholder="Ví dụ: 1"
        value={patientId}
        onChangeText={setPatientId}
        keyboardType="numeric"
      />

      <ActionButton
        title="Tải lịch hẹn"
        onPress={handleLoad}
      />

      {loading ? (
        <Text>Loading...</Text>
      ) : null}

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      {message ? (
        <Text style={styles.message}>
          {message}
        </Text>
      ) : null}

      <FlatList
        data={patientAppointments}
        keyExtractor={(item, index) =>
          item?.MaLichHen?.toString?.() ||
          index.toString()
        }
        ListEmptyComponent={
          <Text>
            Không có lịch hẹn
          </Text>
        }
        renderItem={({ item }) => (
          <AppointmentCard
            item={item}
            mode="patient"
            onCancel={handleCancel}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  error: {
    color: "#f44336",
    marginBottom: 10,
  },

  message: {
    color: "#4CAF50",
    marginBottom: 10,
  },
});

export default PatientAppointmentList;
