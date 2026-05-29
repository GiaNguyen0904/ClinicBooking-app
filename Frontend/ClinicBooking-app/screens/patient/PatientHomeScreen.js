import React from "react";

import PatientDashboard from "../../components/patient/PatientDashboard";

const PatientHomeScreen = ({
  navigation,
}) => {
  return (
    <PatientDashboard
      navigation={navigation}
    />
  );
};

export default PatientHomeScreen;
