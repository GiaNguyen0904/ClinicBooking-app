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
  fetchDoctorStats,
} from "../../redux/clinicSlice";

const DoctorStatsScreen = () => {
  const dispatch = useDispatch();

  const stats = useSelector(
    (state) => state.clinic.doctorStats
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchDoctorStats());
    }, [dispatch])
  );

  return (
    <StatsList
      title="Thống kê lịch hẹn theo bác sĩ"
      data={stats}
      getKey={(item) => item.MaBacSi}
      renderLines={(item) => [
        item.HoTen,
        `Mã bác sĩ: ${item.MaBacSi}`,
        `Số lượng lịch hẹn: ${item.SoLuongLichHen}`,
      ]}
    />
  );
};

export default DoctorStatsScreen;
