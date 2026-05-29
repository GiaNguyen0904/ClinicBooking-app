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
  createDoctorAccount,
} from "../../redux/clinicSlice";

const CreateDoctorScreen = ({
  navigation,
}) => {
  const dispatch = useDispatch();

  const error = useSelector(
    (state) => state.clinic.error
  );

  const [form, setForm] = useState({
    TenDangNhap: "",
    MatKhau: "",
    HoTen: "",
    SoDienThoai: "",
    Email: "",
    ChuyenKhoa: "",
    MaPhongKham: "",
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
      createDoctorAccount(form)
    );

    if (createDoctorAccount.fulfilled.match(result)) {
      navigation.goBack();
    }
  };

  return (
    <DoctorForm
      title="Tạo tài khoản bác sĩ"
      form={form}
      error={error}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={() => navigation.goBack()}
    />
  );
};

export default CreateDoctorScreen;
