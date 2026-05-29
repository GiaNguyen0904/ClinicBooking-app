import React, {
  useEffect,
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
  fetchAppointments,
  updateAppointmentStatusThunk,
} from "../../redux/appointmentSlice";

import TextField from "../common/TextField";
import ActionButton from "../common/ActionButton";
import AppointmentCard from "./AppointmentCard";

const AdminAppointmentList = () => {
  const dispatch = useDispatch();

  const {
    appointments,
    loading,
    error,
    message,
  } = useSelector(
    (state) => state.appointment
  );

  const [date, setDate] =
    useState("");

  const [status, setStatus] =
    useState("");

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleSearch = () => {
    const params = {};

    if (date) {
      params.Ngay = date;
    }

    if (status) {
      params.TrangThai = status;
    }

    dispatch(fetchAppointments(params));
  };

  const handleStatusChange = async (
    id,
    TrangThai
  ) => {
    try {
      await dispatch(
        updateAppointmentStatusThunk({
          id,
          TrangThai,
        })
      ).unwrap();

      dispatch(fetchAppointments());
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err || "Không thể cập nhật trạng thái"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Quản lý lịch hẹn
      </Text>

      <TextField
        label="Lọc theo ngày"
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />

      <TextField
        label="Lọc theo trạng thái"
        placeholder="Chờ xác nhận / Đã xác nhận / Đang thực hiện..."
        value={status}
        onChangeText={setStatus}
      />

      <ActionButton
        title="Lọc lịch hẹn"
        onPress={handleSearch}
      />

      <ActionButton
        title="Xem lịch chờ xác nhận"
        variant="success"
        onPress={() => {
          setStatus("Chờ xác nhận");

          dispatch(
            fetchAppointments({
              TrangThai: "Chờ xác nhận",
            })
          );
        }}
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
        data={appointments}
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
            mode="admin"
            onStatusChange={handleStatusChange}
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

export default AdminAppointmentList;
