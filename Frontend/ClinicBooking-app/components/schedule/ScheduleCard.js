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

 const formatTime = (time) => {
  if (!time) return "--:--";

  // Trường hợp "08:00:00"
  if (typeof time === "string" && time.includes(":")) {
    return time.slice(0, 5);
  }

  // Trường hợp ISO Date
  const date = new Date(time);
  if (isNaN(date.getTime())) return "--:--";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  if (isNaN(d.getTime())) return date; // fallback nếu backend gửi string lạ

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Ngày: {formatDate(item.Ngay)}
      </Text>

      <Text>
          Giờ: {formatTime(item.GioBatDau)} - {formatTime(item.GioKetThuc)}
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