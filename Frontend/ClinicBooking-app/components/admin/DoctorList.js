import { useFocusEffect } from "@react-navigation/native"
import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
;

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";

import ActionButton from "../common/ActionButton";
import clinicApi from "../../api/clinicApi";

const DoctorList = ({
  navigation,
}) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const showMessage = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n${message}`);
      return;
    }

    Alert.alert(title, message);
  };

  const loadDoctors = async () => {
    try {
      setLoading(true);

      const data = await clinicApi.getDoctorAccounts();

      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Không thể tải danh sách bác sĩ";

      showMessage("Lỗi", message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
  useCallback(() => {
    loadDoctors();
  }, [])
);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);

      await clinicApi.deleteDoctor(id);

      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.MaTaiKhoan !== id)
      );

      showMessage(
        "Thành công",
        "Đã xóa tài khoản bác sĩ"
      );
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Không thể xóa tài khoản bác sĩ";

      showMessage("Lỗi", message);
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (id) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Bạn có chắc muốn xóa tài khoản bác sĩ này?"
      );

      if (confirmed) {
        handleDelete(id);
      }

      return;
    }

    Alert.alert(
      "Xóa bác sĩ",
      "Bạn có chắc muốn xóa tài khoản này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => handleDelete(id),
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isDeleting = deletingId === item.MaTaiKhoan;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("DoctorDetail", { doctor: item })}
        activeOpacity={0.8}
      >
        <Text style={styles.name}>{item.HoTen}</Text>
        <Text>Tên đăng nhập: {item.TenDangNhap}</Text>
        <Text>Chuyên khoa: {item.ChuyenKhoa || "Chưa có"}</Text>
        <Text>Số điện thoại: {item.SoDienThoai || "Chưa có"}</Text>
        <Text>Email: {item.Email || "Chưa có"}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={(event) => {
              event.stopPropagation?.();
              navigation.navigate("EditDoctor", { doctor: item });
            }}
          >
            <Text style={styles.buttonText}>Sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              isDeleting && styles.disabledButton,
            ]}
            disabled={isDeleting}
            onPress={(event) => {
              event.stopPropagation?.();
              confirmDelete(item.MaTaiKhoan);
            }}
          >
            <Text style={styles.buttonText}>
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý tài khoản bác sĩ</Text>

      <ActionButton
        title="Tạo tài khoản bác sĩ"
        onPress={() => navigation.navigate("CreateDoctor")}
      />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" />
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item, index) =>
            item.MaTaiKhoan?.toString() || index.toString()
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có dữ liệu bác sĩ</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
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

  loadingBox: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  listContent: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  actions: {
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

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  emptyText: {
    marginTop: 12,
    color: "#555",
  },
});

export default DoctorList;