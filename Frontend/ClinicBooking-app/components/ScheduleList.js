import React, {
  useState,
  useEffect,
} from "react";

import {View,FlatList,Text,TouchableOpacity, Modal,StyleSheet,Alert,} from "react-native";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchSchedules,
  deleteScheduleThunk,
} from "../redux/scheduleSlice";

import ScheduleCard from "./ScheduleCard";
import ScheduleForm from "./ScheduleForm";



const ScheduleList = () => {

    const dispatch = useDispatch();

    const {
    schedules,
    loading,
    error,
    } = useSelector(
    (state) => state.schedule
    );

    useEffect(() => {
    dispatch(fetchSchedules());
    }, []);
  const [modalVisible, setModalVisible] =
    useState(false);

  const [mode, setMode] =
    useState("create");

  const [selectedSchedule,
    setSelectedSchedule] =
    useState(null);

  const handleCreate = () => {
    setMode("create");

    setSelectedSchedule(null);

    setModalVisible(true);
  };

  const handleEdit = (schedule) => {
    setMode("update");

    setSelectedSchedule(schedule);

    setModalVisible(true);
  };

const handleDelete = (id) => {
  Alert.alert(
    "Xóa khung giờ",
    "Bạn có chắc muốn xóa?",
    [
      {
        text: "Hủy",
      },

      {
        text: "Xóa",

        onPress: () => {
          dispatch(
            deleteScheduleThunk(id)
          );
        },
      },
    ]
  );
};
if (loading) {
  return (
    <Text>Loading...</Text>
  );
}

if (error) {
  return <Text>{error}</Text>;
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Quản lý khung giờ
      </Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreate}
      >
        <Text style={styles.buttonText}>
          Tạo khung giờ
        </Text>
      </TouchableOpacity>

      <FlatList
        data={schedules}
        keyExtractor={(item) =>
          item.MaKhungGio.toString()
        }
        renderItem={({ item }) => (
          <ScheduleCard
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <ScheduleForm
            mode={mode}
            initialData={
              selectedSchedule
            }
            onClose={() =>
              setModalVisible(false)
            }
          />
        </View>
      </Modal>
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

  createButton: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor:
      "rgba(0,0,0,0.5)",
  },
});

export default ScheduleList;