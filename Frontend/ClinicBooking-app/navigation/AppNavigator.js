import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import PatientRegisterScreen from "../screens/auth/PatientRegisterScreen";

import AdminHomeScreen from "../screens/admin/AdminHomeScreen";
import DoctorAccountsScreen from "../screens/admin/DoctorAccountsScreen";
import CreateDoctorScreen from "../screens/admin/CreateDoctorScreen";
import EditDoctorScreen from "../screens/admin/EditDoctorScreen";
import DoctorDetailScreen from "../screens/admin/DoctorDetailScreen";
import StatisticsScreen from "../screens/admin/StatisticsScreen";
import PatientStatsScreen from "../screens/admin/PatientStatsScreen";
import ServiceStatsScreen from "../screens/admin/ServiceStatsScreen";
import DoctorStatsScreen from "../screens/admin/DoctorStatsScreen";
import TimeSlotStatsScreen from "../screens/admin/TimeSlotStatsScreen";
import AppointmentManagementScreen from "../screens/admin/AppointmentManagementScreen";

import DoctorHomeScreen from "../screens/doctor/DoctorHomeScreen";
import PatientHomeScreen from "../screens/patient/PatientHomeScreen";
import BookAppointmentScreen from "../screens/patient/BookAppointmentScreen";
import MyAppointmentsScreen from "../screens/patient/MyAppointmentsScreen";

import ScheduleManagementScreen from "../screens/schedule/ScheduleManagementScreen";
import AvailableScheduleScreen from "../screens/schedule/AvailableScheduleScreen";

const Stack =
  createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Đăng nhập" }} />
      <Stack.Screen name="PatientRegister" component={PatientRegisterScreen} options={{ title: "Đăng ký khách hàng" }} />

      <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: "Quản lý" }} />
      <Stack.Screen name="DoctorAccounts" component={DoctorAccountsScreen} options={{ title: "Tài khoản bác sĩ" }} />
      <Stack.Screen name="CreateDoctor" component={CreateDoctorScreen} options={{ title: "Tạo bác sĩ" }} />
      <Stack.Screen name="EditDoctor" component={EditDoctorScreen} options={{ title: "Sửa bác sĩ" }} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} options={{ title: "Chi tiết bác sĩ" }} />
      <Stack.Screen name="AppointmentManagement" component={AppointmentManagementScreen} options={{ title: "Quản lý lịch hẹn" }} />

      <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: "Thống kê" }} />
      <Stack.Screen name="PatientStats" component={PatientStatsScreen} options={{ title: "Thống kê bệnh nhân" }} />
      <Stack.Screen name="ServiceStats" component={ServiceStatsScreen} options={{ title: "Thống kê dịch vụ" }} />
      <Stack.Screen name="DoctorStats" component={DoctorStatsScreen} options={{ title: "Thống kê bác sĩ" }} />
      <Stack.Screen name="TimeSlotStats" component={TimeSlotStatsScreen} options={{ title: "Thống kê khung giờ" }} />

      <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} options={{ title: "Bác sĩ" }} />
      <Stack.Screen name="PatientHome" component={PatientHomeScreen} options={{ title: "Khách hàng" }} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{ title: "Đặt lịch" }} />
      <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} options={{ title: "Lịch hẹn của tôi" }} />

      <Stack.Screen name="ScheduleManagement" component={ScheduleManagementScreen} options={{ title: "Quản lý khung giờ" }} />
      <Stack.Screen name="AvailableSchedules" component={AvailableScheduleScreen} options={{ title: "Khung giờ trống" }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
