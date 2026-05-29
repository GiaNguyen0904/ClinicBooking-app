import React from "react";

import DoctorList from "../../components/admin/DoctorList";

const DoctorAccountsScreen = ({
  navigation,
}) => {
  return (
    <DoctorList navigation={navigation} />
  );
};

export default DoctorAccountsScreen;