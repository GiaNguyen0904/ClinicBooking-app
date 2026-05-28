import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ScheduleCard = ({
  item,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Ngày: {item.Ngay}
      </Text>

      <Text>
        Giờ:
        {item.GioBatDau} -{" "}
        {item.GioKetThuc}
      </Text>

      <Text>
        Bác sĩ:
        {item.MaBacSi}
      </Text>

      <Text>
        Số lượng tối đa:
        {item.SoLuongToiDa}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.buttonText}>
            Sửa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            onDelete(item.MaKhungGio)
          }
        >
          <Text style={styles.buttonText}>
            Xóa
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },

  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },

  buttonContainer: {
    flexDirection: "row",
    marginTop: 12,
  },

  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ScheduleCard;