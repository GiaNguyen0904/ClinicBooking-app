import React from "react";

import {
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

import ActionButton from "../common/ActionButton";
import TextField from "../common/TextField";

const PatientRegisterForm = ({
  form,
  error,
  message,
  onChange,
  onSubmit,
  onBack,
}) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Đăng ký khách hàng
      </Text>

      <TextField label="Tên đăng nhập" placeholder="vd: phuc@khachhang" value={form.TenDangNhap} onChangeText={(text) => onChange("TenDangNhap", text)} />
      <TextField label="Mật khẩu" placeholder="Nhập mật khẩu" value={form.MatKhau} secureTextEntry onChangeText={(text) => onChange("MatKhau", text)} />
      <TextField label="Họ tên" placeholder="Nhập họ tên" value={form.HoTen} onChangeText={(text) => onChange("HoTen", text)} />
      <TextField label="Ngày sinh" placeholder="YYYY-MM-DD" value={form.NgaySinh} onChangeText={(text) => onChange("NgaySinh", text)} />
      <TextField label="Giới tính" placeholder="NAM hoặc NU" value={form.GioiTinh} onChangeText={(text) => onChange("GioiTinh", text)} />
      <TextField label="Số điện thoại" placeholder="10 chữ số" value={form.SoDienThoai} keyboardType="numeric" onChangeText={(text) => onChange("SoDienThoai", text)} />
      <TextField label="Địa chỉ" placeholder="Nhập địa chỉ" value={form.DiaChi} onChangeText={(text) => onChange("DiaChi", text)} />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}

      <ActionButton title="Đăng ký" onPress={onSubmit} />
      <ActionButton title="Quay lại đăng nhập" variant="muted" onPress={onBack} />
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
    textAlign: "center",
  },

  error: {
    color: "#f44336",
    marginBottom: 12,
    textAlign: "center",
  },

  success: {
    color: "#4CAF50",
    marginBottom: 12,
    textAlign: "center",
  },
});

export default PatientRegisterForm;
