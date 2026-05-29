import React, { useEffect, useState } from "react";

import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  View,
} from "react-native";

import axios from "axios";
import { Calendar } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAvailableAppointmentSlots,
  createAppointmentThunk,
  clearAppointmentMessage,
} from "../../redux/appointmentSlice";

import { fetchDoctorAccounts } from "../../redux/clinicSlice";

import TextField from "../common/TextField";
import ActionButton from "../common/ActionButton";

const SERVICE_API_URL = "http://10.106.39.171:5555/api/services";

const BookingForm = ({ navigation }) => {
  const dispatch = useDispatch();

  const { availableSlots, loading, error, message } = useSelector(
    (state) => state.appointment
  );

  const { user, doctors } = useSelector(
    (state) => state.clinic
  );

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);

  const [doctorId, setDoctorId] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorDropdownVisible, setDoctorDropdownVisible] = useState(false);

  const [patientId, setPatientId] = useState(
    user?.MaBenhNhan ? user.MaBenhNhan.toString() : ""
  );

  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [serviceDropdownVisible, setServiceDropdownVisible] = useState(false);

  const [quantity, setQuantity] = useState("1");
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    dispatch(clearAppointmentMessage());
    dispatch(fetchDoctorAccounts());
    fetchServices();
  }, [dispatch]);

  const fetchServices = async () => {
    try {
      const res = await axios.get(SERVICE_API_URL);
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tải danh sách dịch vụ");
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorId(doctor.MaBacSi.toString());
    setSelectedSlot(null);
    setDoctorDropdownVisible(false);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setServiceId(service.MaDichVu.toString());
    setSelectedSlot(null);
    setServiceDropdownVisible(false);
  };

  const handleLoadSlots = () => {
    if (!doctorId) {
      Alert.alert("Thiếu thông tin", "Chọn bác sĩ trước");
      return;
    }

    setSelectedSlot(null);

    dispatch(
      fetchAvailableAppointmentSlots({
        MaBacSi: Number(doctorId),
        Ngay: selectedDate,
      })
    );
  };

  const handleCreateAppointment = async () => {
    if (!patientId || !doctorId || !selectedSlot || !serviceId) {
      Alert.alert(
        "Thiếu thông tin",
        "Cần nhập bệnh nhân, chọn bác sĩ, chọn dịch vụ và chọn khung giờ"
      );
      return;
    }

    const payload = {
      MaBenhNhan: Number(patientId),
      MaBacSi: Number(doctorId),
      MaKhungGio: selectedSlot.MaKhungGio,
      NgayHen: selectedDate,
      DichVu: [
        {
          MaDichVu: Number(serviceId),
          SoLuong: Number(quantity) || 1,
        },
      ],
    };

    try {
      await dispatch(createAppointmentThunk(payload)).unwrap();

      Alert.alert(
        "Thành công",
        "Đặt lịch thành công, đang chờ xác nhận"
      );

      navigation.navigate("MyAppointments");
    } catch (err) {
      Alert.alert("Lỗi", err || "Không thể đặt lịch");
    }
  };

  const formatTime = (value) => {
    if (!value) return "--:--";
    if (typeof value === "string" && value.includes(":")) return value.slice(0, 5);
    return value;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Đặt lịch khám</Text>

      <TextField
        label="Mã bệnh nhân"
        placeholder="Ví dụ: 1"
        value={patientId}
        onChangeText={setPatientId}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Chọn bác sĩ</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setDoctorDropdownVisible(true)}
      >
        <Text style={selectedDoctor ? styles.dropdownText : styles.placeholderText}>
          {selectedDoctor
            ? `${selectedDoctor.HoTen} - ${selectedDoctor.ChuyenKhoa || "Chưa có chuyên khoa"}`
            : "Nhấn để chọn bác sĩ"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Chọn dịch vụ</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setServiceDropdownVisible(true)}
      >
        <Text style={selectedService ? styles.dropdownText : styles.placeholderText}>
          {selectedService
            ? `${selectedService.TenDichVu} - ${Number(selectedService.Gia || 0).toLocaleString()}đ`
            : "Nhấn để chọn dịch vụ"}
        </Text>
      </TouchableOpacity>

      <TextField
        label="Số lượng dịch vụ"
        placeholder="1"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Chọn ngày</Text>

      <Calendar
        current={selectedDate}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setSelectedSlot(null);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#2196F3",
          },
        }}
      />

      <ActionButton
        title="Tải khung giờ còn trống"
        onPress={handleLoadSlots}
      />

      {loading ? <Text>Loading...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <FlatList
        data={availableSlots}
        scrollEnabled={false}
        keyExtractor={(item, index) =>
          item?.MaKhungGio?.toString?.() || index.toString()
        }
        ListEmptyComponent={
          <Text>Chưa có khung giờ trống</Text>
        }
        renderItem={({ item }) => {
          const isSelected = selectedSlot?.MaKhungGio === item.MaKhungGio;

          return (
            <TouchableOpacity
              style={[
                styles.slotCard,
                isSelected && styles.selectedSlot,
              ]}
              onPress={() => setSelectedSlot(item)}
            >
              <Text style={styles.slotTitle}>
                {formatTime(item.GioBatDau)} - {formatTime(item.GioKetThuc)}
              </Text>

              <Text>Còn lại: {item.SoLuongConLai}</Text>
              <Text>Mã khung giờ: {item.MaKhungGio}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <ActionButton
        title="Xác nhận đặt lịch"
        variant="success"
        onPress={handleCreateAppointment}
      />

      <Modal
        visible={doctorDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDoctorDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Chọn bác sĩ</Text>

            <FlatList
              data={doctors || []}
              keyExtractor={(item, index) =>
                item?.MaBacSi?.toString?.() || index.toString()
              }
              ListEmptyComponent={
                <Text>Chưa có danh sách bác sĩ</Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectItem}
                  onPress={() => handleSelectDoctor(item)}
                >
                  <Text style={styles.itemName}>{item.HoTen}</Text>
                  <Text>Chuyên khoa: {item.ChuyenKhoa || "Chưa có"}</Text>
                  <Text>Mã bác sĩ: {item.MaBacSi}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDoctorDropdownVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={serviceDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setServiceDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Chọn dịch vụ</Text>

            <FlatList
              data={services}
              keyExtractor={(item, index) =>
                item?.MaDichVu?.toString?.() || index.toString()
              }
              ListEmptyComponent={
                <Text>Chưa có danh sách dịch vụ</Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectItem}
                  onPress={() => handleSelectService(item)}
                >
                  <Text style={styles.itemName}>{item.TenDichVu}</Text>
                  <Text>Giá: {Number(item.Gia || 0).toLocaleString()}đ</Text>
                  <Text>Bác sĩ phụ trách: {item.TenBacSi || item.MaBacSi || "Chưa có"}</Text>
                  {item.MoTa ? <Text>{item.MoTa}</Text> : null}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setServiceDropdownVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },

  dropdown: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  dropdownText: {
    color: "#000",
  },

  placeholderText: {
    color: "#777",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },

  slotCard: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },

  selectedSlot: {
    borderWidth: 2,
    borderColor: "#2196F3",
  },

  slotTitle: {
    fontWeight: "bold",
    marginBottom: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },

  selectItem: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },

  itemName: {
    fontWeight: "bold",
    marginBottom: 4,
  },

  closeButton: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
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

export default BookingForm;