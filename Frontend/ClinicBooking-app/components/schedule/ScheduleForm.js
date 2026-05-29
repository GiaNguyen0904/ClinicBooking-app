import React, { useState, useEffect } from "react";
import {
  useDispatch,
} from "react-redux";

import {
  createScheduleThunk,
  updateScheduleThunk,
  fetchSchedules,
} from "../../redux/scheduleSlice";

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

  const normalizeDate = (value) => {
  if (!value) return "";

  const d = new Date(value);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

  const formatDate = (value) => {
  if (!value) return "";

  // case ISO string
  if (value.includes("T")) {
    return value.split("T")[0];
  }

  return value;
};

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
  if (mode === "update" && initialData) {
    setDoctorId(initialData.MaBacSi?.toString() || "");

    setDate(normalizeDate(initialData.Ngay)); // 🔥 FIX CHÍNH

    setStartTime(initialData.GioBatDau || "");
    setEndTime(initialData.GioKetThuc || "");
    setMaxSlot(initialData.SoLuongToiDa?.toString() || "");
  }
}, [mode, initialData]);

  const handleSubmit = async () => {
  const payload = {
    MaBacSi: Number(doctorId),
    Ngay: normalizeDate(date),
    GioBatDau: startTime,
    GioKetThuc: endTime,
    SoLuongToiDa: Number(maxSlot),
  };

  try {
    if (mode === "create") {
      await dispatch(createScheduleThunk(payload)).unwrap();
    } else {
      await dispatch(updateScheduleThunk({
        id: initialData.MaKhungGio,
        data: payload,
      })).unwrap();
    }

    //  ALWAYS REFRESH FROM SERVER
    dispatch(fetchSchedules());

    onClose();
  } catch (err) {
    console.log("ERROR:", err);
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