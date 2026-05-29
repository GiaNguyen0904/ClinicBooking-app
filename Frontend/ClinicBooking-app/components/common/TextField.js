import React from "react";

import {
  Text,
  TextInput,
  StyleSheet,
} from "react-native";

const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
}) => {
  return (
    <>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
      />
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
});

export default TextField;
