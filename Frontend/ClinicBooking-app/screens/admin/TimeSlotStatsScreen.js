import React, {
  useCallback,
} from "react";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import StatsList from "../../components/admin/StatsList";

import {
  fetchTimeSlotStats,
} from "../../redux/clinicSlice";

const TimeSlotStatsScreen = () => {
  const dispatch = useDispatch();

  const stats = useSelector(
    (state) => state.clinic.timeSlotStats
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchTimeSlotStats());
    }, [dispatch])
  );

  return (
    <StatsList
      title="Thống kê khung giờ được đặt nhiều nhất"
      data={stats}
      getKey={(item) => item.MaKhungGio}
      renderLines={(item) => [
        `${item.GioBatDau} - ${item.GioKetThuc}`,
        `Mã khung giờ: ${item.MaKhungGio}`,
        `Số lượng đặt: ${item.SoLuongDat}`,
      ]}
    />
  );
};

export default TimeSlotStatsScreen;
