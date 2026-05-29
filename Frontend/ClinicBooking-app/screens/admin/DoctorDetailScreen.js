import React from "react";

import DoctorDetailCard from "../../components/admin/DoctorDetailCard";

const DoctorDetailScreen = ({
  route,
}) => {
  return (
    <DoctorDetailCard
      doctor={route.params.doctor}
    />
  );
};

export default DoctorDetailScreen;
