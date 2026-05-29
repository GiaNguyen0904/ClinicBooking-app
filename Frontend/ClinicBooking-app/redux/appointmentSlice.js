import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import appointmentApi from "../api/appointmentApi";

const getErrorMessage = (
  error,
  fallback
) => {
  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    fallback
  );
};

export const fetchAppointments =
  createAsyncThunk(
    "appointment/fetchAppointments",
    async (params, thunkAPI) => {
      try {
        return await appointmentApi.getAppointments(
          params || {}
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(
            error,
            "Không thể tải lịch hẹn"
          )
        );
      }
    }
  );

export const fetchAppointmentDetail =
  createAsyncThunk(
    "appointment/fetchAppointmentDetail",
    async (id, thunkAPI) => {
      try {
        return await appointmentApi.getAppointmentById(
          id
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(
            error,
            "Không thể tải chi tiết lịch hẹn"
          )
        );
      }
    }
  );

export const fetchPatientAppointments =
  createAsyncThunk(
    "appointment/fetchPatientAppointments",
    async (MaBenhNhan, thunkAPI) => {
      try {
        return await appointmentApi.getAppointmentsByPatient(
          MaBenhNhan
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(
            error,
            "Không thể tải lịch hẹn của bệnh nhân"
          )
        );
      }
    }
  );

export const fetchAvailableAppointmentSlots =
  createAsyncThunk(
    "appointment/fetchAvailableAppointmentSlots",
    async (data, thunkAPI) => {
      try {
        return await appointmentApi.getAvailableSlots(
          data
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(
            error,
            "Không thể tải khung giờ trống"
          )
        );
      }
    }
  );

export const createAppointmentThunk =
  createAsyncThunk(
    "appointment/createAppointment",
    async (data, thunkAPI) => {
      try {
        return await appointmentApi.createAppointment(
          data
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(
            error,
            "Không thể đặt lịch"
          )
        );
      }
    }
  );

export const updateAppointmentStatusThunk =
  createAsyncThunk(
    "appointment/updateAppointmentStatus",
    async (
      { id, TrangThai },
      thunkAPI
    ) => {
      try {
        await appointmentApi.updateAppointmentStatus(
          id,
          TrangThai
        );

        return {
          MaLichHen: id,
          TrangThai,
        };
      } catch (error) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(
            error,
            "Không thể cập nhật trạng thái"
          )
        );
      }
    }
  );

export const cancelAppointmentThunk =
  createAsyncThunk(
    "appointment/cancelAppointment",
    async (id, thunkAPI) => {
      try {
        await appointmentApi.cancelAppointment(id);

        return {
          MaLichHen: id,
          TrangThai: "Đã hủy",
        };
      } catch (error) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(
            error,
            "Không thể hủy lịch"
          )
        );
      }
    }
  );

const initialState = {
  appointments: [],
  patientAppointments: [],
  availableSlots: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  message: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearAppointmentMessage: (state) => {
      state.error = null;
      state.message = null;
    },

    clearAvailableSlots: (state) => {
      state.availableSlots = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = Array.isArray(action.payload)
          ? action.payload
          : Array.isArray(action.payload?.data)
            ? action.payload.data
            : [];
      })

      .addCase(fetchAppointmentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAppointment =
          action.payload?.data || action.payload || null;
      })

      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.patientAppointments = Array.isArray(action.payload)
          ? action.payload
          : Array.isArray(action.payload?.data)
            ? action.payload.data
            : [];
      })

      .addCase(fetchAvailableAppointmentSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = Array.isArray(action.payload)
          ? action.payload
          : Array.isArray(action.payload?.data)
            ? action.payload.data
            : [];
      })

      .addCase(createAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message =
          action.payload?.message || "Đặt lịch thành công";
      })

      .addCase(updateAppointmentStatusThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.appointments = state.appointments.map((item) =>
          item.MaLichHen === action.payload.MaLichHen
            ? {
                ...item,
                TrangThai: action.payload.TrangThai,
              }
            : item
        );

        state.patientAppointments = state.patientAppointments.map((item) =>
          item.MaLichHen === action.payload.MaLichHen
            ? {
                ...item,
                TrangThai: action.payload.TrangThai,
              }
            : item
        );

        state.message = "Cập nhật trạng thái thành công";
      })

      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.patientAppointments = state.patientAppointments.map((item) =>
          item.MaLichHen === action.payload.MaLichHen
            ? {
                ...item,
                TrangThai: action.payload.TrangThai,
              }
            : item
        );

        state.message = "Hủy lịch thành công";
      })

      .addMatcher(
        (action) =>
          action.type.startsWith("appointment/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.message = null;
        }
      )

      .addMatcher(
        (action) =>
          action.type.startsWith("appointment/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Có lỗi xảy ra";
        }
      );
  },
});

export const {
  clearAppointmentMessage,
  clearAvailableSlots,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
