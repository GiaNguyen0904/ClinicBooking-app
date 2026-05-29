import React from "react";

import BookingForm from "../../components/appointment/BookingForm";

const BookAppointmentScreen = ({
  navigation,
}) => {
  return (
    <BookingForm
      navigation={navigation}
    />
  );
};

export default BookAppointmentScreen;
