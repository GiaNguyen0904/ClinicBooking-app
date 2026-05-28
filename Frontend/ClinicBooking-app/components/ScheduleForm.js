import React, { useState, useEffect } from "react";
import {
  useDispatch,
} from "react-redux";

import {
  createScheduleThunk,
  updateScheduleThunk,
  fetchSchedules,
} from "../redux/scheduleSlice";

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

const ScheduleForm = ({
  mode,
  initialData,
  onClose,
}) => {

  const dispatch = useDispatch();
  const [doctorId, setDoctorId] =
    useState("");

  const [date, setDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [maxSlot, setMaxSlot] =
    useState("");

  useEffect(() => {
    if (
      mode === "update" &&
      initialData
    ) {
      setDoctorId(
        initialData.MaBacSi.toString()
      );

      setDate(initialData.Ngay);

      setStartTime(
        initialData.GioBatDau
      );

      setEndTime(
        initialData.GioKetThuc
      );

      setMaxSlot(
        initialData.SoLuongToiDa.toString()
      );
    }
  }, []);

  const handleSubmit = async () => {
  const payload = {
    MaBacSi: Number(doctorId),
    Ngay: date,
    GioBatDau: startTime,
    GioKetThuc: endTime,
    SoLuongToiDa: Number(maxSlot),
  };

  try {
    if (mode === "create") {
      await dispatch(
        createScheduleThunk(payload)
      );
    } else {
      await dispatch(
        updateScheduleThunk({
          id: initialData.MaKhungGio,
          data: payload,
        })
      );
    }

    dispatch(fetchSchedules());

    onClose();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "create"
          ? "Tạo khung giờ"
          : "Cập nhật khung giờ"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Mã bác sĩ"
        value={doctorId}
        onChangeText={setDoctorId}
      />

      <TextInput
        style={styles.input}
        placeholder="Ngày"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Giờ bắt đầu"
        value={startTime}
        onChangeText={setStartTime}
      />

      <TextInput
        style={styles.input}
        placeholder="Giờ kết thúc"
        value={endTime}
        onChangeText={setEndTime}
      />

      <TextInput
        style={styles.input}
        placeholder="Số lượng tối đa"
        value={maxSlot}
        onChangeText={setMaxSlot}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          {mode === "create"
            ? "Tạo"
            : "Cập nhật"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onClose}
      >
        <Text style={styles.buttonText}>
          Đóng
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  submitButton: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },

  cancelButton: {
    backgroundColor: "#777",
    padding: 14,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ScheduleForm;