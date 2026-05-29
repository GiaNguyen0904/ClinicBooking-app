import React, {
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import LoginForm from "../../components/auth/LoginForm";

import {
  loginUser,
} from "../../redux/clinicSlice";

const LoginScreen = ({
  navigation,
}) => {
  const dispatch = useDispatch();

  const {
    loading,
    error,
  } = useSelector(
    (state) => state.clinic
  );

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const openHomeByRole = (role) => {
    if (role === "Bác sĩ") {
      navigation.replace("DoctorHome");
      return;
    }

    if (role === "Khách hàng") {
      navigation.replace("PatientHome");
      return;
    }

    navigation.replace("AdminHome");
  };

  const handleLogin = async () => {
    const result = await dispatch(
      loginUser({
        TenDangNhap: username,
        MatKhau: password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      openHomeByRole(
        result.payload?.VaiTro
      );
    }
  };

  return (
    <LoginForm
      username={username}
      password={password}
      error={error}
      loading={loading}
      onChangeUsername={setUsername}
      onChangePassword={setPassword}
      onLogin={handleLogin}
      onRegister={() => navigation.navigate("PatientRegister")}
    />
  );
};

export default LoginScreen;
