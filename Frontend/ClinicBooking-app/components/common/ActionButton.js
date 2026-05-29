import React from "react";

import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ActionButton = ({
  title,
  onPress,
  variant = "primary",
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },

  primary: {
    backgroundColor: "#2196F3",
  },

  success: {
    backgroundColor: "#4CAF50",
  },

  danger: {
    backgroundColor: "#f44336",
  },

  muted: {
    backgroundColor: "#777",
  },

  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ActionButton;
