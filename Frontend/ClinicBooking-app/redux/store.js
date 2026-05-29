import { configureStore }
from "@reduxjs/toolkit";

import scheduleReducer
from "./scheduleSlice";

import clinicReducer
from "./clinicSlice";

import appointmentReducer
from "./appointmentSlice";

const store = configureStore({
  reducer: {
    schedule: scheduleReducer,
    clinic: clinicReducer,
    appointment: appointmentReducer,
  },
});

export default store;
