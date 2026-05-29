import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import ActionButton from "../common/ActionButton";
import TextField from "../common/TextField";

const LoginForm = ({
  username,
  password,
  error,
  loading,
  onChangeUsername,
  onChangePassword,
  onLogin,
  onRegister,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Đăng nhập phòng khám
      </Text>

      <TextField
        label="Tên đăng nhập"
        placeholder="admin01@phongkham"
        value={username}
        onChangeText={onChangeUsername}
      />

      <TextField
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        value={password}
        secureTextEntry
        onChangeText={onChangePassword}
      />

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

      <ActionButton
        title={loading ? "Đang đăng nhập..." : "Đăng nhập"}
        onPress={onLogin}
      />

      <ActionButton
        title="Đăng ký khách hàng"
        variant="muted"
        onPress={onRegister}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },

  error: {
    color: "#f44336",
    marginBottom: 12,
    textAlign: "center",
  },
});

export default LoginForm;
