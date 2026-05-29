import React from "react";

import {
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";

import InfoCard from "../common/InfoCard";

const DoctorDetailCard = ({
  doctor,
}) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Chi tiết bác sĩ
      </Text>

      <InfoCard label="Mã bác sĩ" value={doctor.MaBacSi?.toString()} />
      <InfoCard label="Họ tên" value={doctor.HoTen} />
      <InfoCard label="Số điện thoại" value={doctor.SoDienThoai} />
      <InfoCard label="Email" value={doctor.Email} />
      <InfoCard label="Chuyên khoa" value={doctor.ChuyenKhoa} />
      <InfoCard label="Mã tài khoản" value={doctor.MaTaiKhoan?.toString()} />
      <InfoCard label="Tên đăng nhập" value={doctor.TenDangNhap} />
      <InfoCard label="Vai trò" value={doctor.VaiTro} />
      <InfoCard label="Mã phòng khám" value={doctor.MaPhongKham?.toString()} />
    </ScrollView>
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
});

export default DoctorDetailCard;
