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
  fetchPatientStats,
} from "../../redux/clinicSlice";

const PatientStatsScreen = () => {
  const dispatch = useDispatch();

  const stats = useSelector(
    (state) => state.clinic.patientStats
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchPatientStats());
    }, [dispatch])
  );

  return (
    <StatsList
      title="Thống kê lịch hẹn theo bệnh nhân"
      data={stats}
      getKey={(item) => item.MaBenhNhan}
      renderLines={(item) => [
        item.TenBenhNhan,
        `Mã bệnh nhân: ${item.MaBenhNhan}`,
        `Số lần đặt: ${item.SoLanDat}`,
      ]}
    />
  );
};

export default PatientStatsScreen;
