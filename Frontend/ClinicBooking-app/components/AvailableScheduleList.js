import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";

import {
  Calendar,
} from "react-native-calendars";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchAvailableSchedules,
} from "../redux/scheduleSlice";

const AvailableScheduleList = () => {

  const dispatch = useDispatch();

  const {
    availableSchedules,
  } = useSelector(
    (state) => state.schedule
  );

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [selectedDate, setSelectedDate] =
    useState(today);

  useEffect(() => {

    dispatch(
      fetchAvailableSchedules(
        selectedDate
      )
    );

  }, [selectedDate]);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Chọn ngày khám
      </Text>

      <Calendar

        current={selectedDate}

        onDayPress={(day) => {
          setSelectedDate(
            day.dateString
          );
        }}

        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#2196F3",
          },
        }}
      />

      <Text style={styles.title}>
        Khung giờ còn trống
      </Text>

      <FlatList
        data={availableSchedules}

        keyExtractor={(item) =>
          item.MaKhungGio.toString()
        }

        ListEmptyComponent={
          <Text>
            Không có lịch trống
          </Text>
        }

        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.date}>
              {item.Ngay}
            </Text>

            <Text>
              {item.GioBatDau} -
              {item.GioKetThuc}
            </Text>

            <Text>
              Bác sĩ:
              {" "}
              {item.HoTen}
            </Text>

            <Text>
              Còn lại:
              {" "}
              {item.SoLuongConLai}
            </Text>

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
    marginVertical: 12,
  },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },

  date: {
    fontWeight: "bold",
    marginBottom: 6,
  },

});

export default AvailableScheduleList;