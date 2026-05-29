import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const AppointmentCard = ({
  item,
  mode = "patient",
  onStatusChange,
  onCancel,
}) => {
  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value;
    }

    const day =
      String(date.getDate()).padStart(2, "0");

    const month =
      String(date.getMonth() + 1).padStart(2, "0");

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatTime = (value) => {
    if (!value) return "--:--";

    if (
      typeof value === "string" &&
      value.includes(":")
    ) {
      return value.slice(0, 5);
    }

    return value;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Mã lịch hẹn: {item.MaLichHen}
      </Text>

      <Text>
        Trạng thái: {item.TrangThai}
      </Text>

      <Text>
        Ngày hẹn: {formatDate(item.NgayHen || item.Ngay)}
      </Text>

      <Text>
        Giờ: {formatTime(item.GioBatDau)} - {formatTime(item.GioKetThuc)}
      </Text>

      <Text>
        Bệnh nhân: {item.TenBenhNhan || item.HoTenBenhNhan || item.MaBenhNhan}
      </Text>

      <Text>
        Bác sĩ: {item.TenBacSi || item.HoTenBacSi || item.MaBacSi}
      </Text>

      {item.ChuyenKhoa ? (
        <Text>
          Chuyên khoa: {item.ChuyenKhoa}
        </Text>
      ) : null}

      {mode === "admin" ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.successButton}
            onPress={() =>
              onStatusChange(
                item.MaLichHen,
                "Đã xác nhận"
              )
            }
          >
            <Text style={styles.buttonText}>
              Xác nhận
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.warningButton}
            onPress={() =>
              onStatusChange(
                item.MaLichHen,
                "Đang thực hiện"
              )
            }
          >
            <Text style={styles.buttonText}>
              Check-in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              onStatusChange(
                item.MaLichHen,
                "Hoàn thành"
              )
            }
          >
            <Text style={styles.buttonText}>
              Hoàn thành
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() =>
              onStatusChange(
                item.MaLichHen,
                "Đã hủy"
              )
            }
          >
            <Text style={styles.buttonText}>
              Hủy
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() =>
            onCancel(item.MaLichHen)
          }
        >
          <Text style={styles.buttonText}>
            Hủy lịch
          </Text>
        </TouchableOpacity>
      )}
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },

  primaryButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  successButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  warningButton: {
    backgroundColor: "#ff9800",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  dangerButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    marginRight: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AppointmentCard;
