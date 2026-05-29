import React from "react";

import DoctorDashboard from "../../components/doctor/DoctorDashboard";

const DoctorHomeScreen = ({
  navigation,
}) => {
  return (
    <DoctorDashboard
      navigation={navigation}
    />
  );
};

export default DoctorHomeScreen;
