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
  fetchServiceStats,
} from "../../redux/clinicSlice";

const ServiceStatsScreen = () => {
  const dispatch = useDispatch();

  const stats = useSelector(
    (state) => state.clinic.serviceStats
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchServiceStats());
    }, [dispatch])
  );

  return (
    <StatsList
      title="Thống kê dịch vụ được sử dụng nhiều nhất"
      data={stats}
      getKey={(item) => item.TenDichVu}
      renderLines={(item) => [
        item.TenDichVu,
        `Giá: ${item.Gia} VND`,
        `Tổng số lượng: ${item.TongSoLuong}`,
      ]}
    />
  );
};

export default ServiceStatsScreen;
