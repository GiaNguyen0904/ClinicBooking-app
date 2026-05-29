import React, {
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import PatientRegisterForm from "../../components/auth/PatientRegisterForm";

import {
  registerPatient,
  clearClinicMessage,
} from "../../redux/clinicSlice";

const PatientRegisterScreen = ({
  navigation,
}) => {
  const dispatch = useDispatch();

  const {
    error,
    message,
  } = useSelector(
    (state) => state.clinic
  );

  const [form, setForm] = useState({
    TenDangNhap: "",
    MatKhau: "",
    HoTen: "",
    NgaySinh: "",
    GioiTinh: "NAM",
    SoDienThoai: "",
    DiaChi: "",
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
      registerPatient(form)
    );

    if (registerPatient.fulfilled.match(result)) {
      setForm({
        TenDangNhap: "",
        MatKhau: "",
        HoTen: "",
        NgaySinh: "",
        GioiTinh: "NAM",
        SoDienThoai: "",
        DiaChi: "",
      });
    }
  };

  return (
    <PatientRegisterForm
      form={form}
      error={error}
      message={message}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onBack={() => navigation.replace("Login")}
    />
  );
};

export default PatientRegisterScreen;
