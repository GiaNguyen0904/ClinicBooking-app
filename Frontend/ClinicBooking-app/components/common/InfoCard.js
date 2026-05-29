import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

const InfoCard = ({
  label,
  value,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value || "Chưa có"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },

  label: {
    color: "#666",
    marginBottom: 6,
  },

  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InfoCard;
