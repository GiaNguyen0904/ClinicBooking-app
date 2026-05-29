import React, {
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import DoctorForm from "../../components/admin/DoctorForm";

import {
  clearClinicMessage,
  updateDoctorAccount,
} from "../../redux/clinicSlice";

const EditDoctorScreen = ({
  route,
  navigation,
}) => {
  const {
    doctor,
  } = route.params;

  const dispatch = useDispatch();

  const error = useSelector(
    (state) => state.clinic.error
  );

  const [form, setForm] = useState({
    TenDangNhap: doctor.TenDangNhap || "",
    MatKhau: "",
    VaiTro: doctor.VaiTro || "Bác sĩ",
    HoTen: doctor.HoTen || "",
    SoDienThoai: doctor.SoDienThoai || "",
    Email: doctor.Email || "",
    ChuyenKhoa: doctor.ChuyenKhoa || "",
    MaPhongKham: doctor.MaPhongKham?.toString() || "",
  });

  const handleChange = (field, value) => {
    dispatch(clearClinicMessage());
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    const result = await dispatch(
      updateDoctorAccount({
        id: doctor.MaTaiKhoan,
        data: form,
      })
    );

    if (updateDoctorAccount.fulfilled.match(result)) {
      navigation.goBack();
    }
  };

  return (
    <DoctorForm
      title="Sửa tài khoản bác sĩ"
      form={form}
      error={error}
      isEdit
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigation.goBack()}
    />
  );
};

export default EditDoctorScreen;
