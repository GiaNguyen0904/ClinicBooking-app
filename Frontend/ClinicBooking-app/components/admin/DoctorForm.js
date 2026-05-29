import React from "react";

import {
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

import ActionButton from "../common/ActionButton";
import TextField from "../common/TextField";

const DoctorForm = ({
  title,
  form,
  error,
  onChange,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      <TextField label="Tên đăng nhập" placeholder="vd: bs01@bacsi" value={form.TenDangNhap} onChangeText={(text) => onChange("TenDangNhap", text)} />
      <TextField label="Mật khẩu" placeholder={isEdit ? "Nhập lại hoặc đổi mật khẩu" : "Nhập mật khẩu"} value={form.MatKhau} secureTextEntry onChangeText={(text) => onChange("MatKhau", text)} />
      <TextField label="Họ tên" placeholder="Nhập họ tên" value={form.HoTen} onChangeText={(text) => onChange("HoTen", text)} />
      <TextField label="Số điện thoại" placeholder="Có thể bỏ trống" value={form.SoDienThoai} keyboardType="numeric" onChangeText={(text) => onChange("SoDienThoai", text)} />
      <TextField label="Email" placeholder="Có thể bỏ trống" value={form.Email} keyboardType="email-address" onChangeText={(text) => onChange("Email", text)} />
      <TextField label="Chuyên khoa" placeholder="Có thể bỏ trống" value={form.ChuyenKhoa} onChangeText={(text) => onChange("ChuyenKhoa", text)} />
      <TextField label="Mã phòng khám" placeholder="Có thể bỏ trống" value={form.MaPhongKham} keyboardType="numeric" onChangeText={(text) => onChange("MaPhongKham", text)} />

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      <ActionButton
        title={isEdit ? "Cập nhật" : "Tạo bác sĩ"}
        onPress={onSubmit}
      />

      <ActionButton
        title="Quay lại"
        variant="muted"
        onPress={onCancel}
      />
    </ScrollView>
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

  error: {
    color: "#f44336",
    marginBottom: 12,
    textAlign: "center",
  },
});

export default DoctorForm;
