import React from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

const StatsList = ({
  title,
  data,
  getKey,
  renderLines,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => getKey?.(item)?.toString() || index.toString()}
        ListEmptyComponent={<Text>Chưa có dữ liệu</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {renderLines(item).map((line, index) => (
              <Text
                key={index}
                style={index === 0 ? styles.mainText : styles.subText}
              >
                {line}
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },

  mainText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  subText: {
    color: "#555",
    marginBottom: 4,
  },
});

export default StatsList;
