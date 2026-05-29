import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import clinicApi from "../api/clinicApi";

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.error || error.message || fallback;
};

export const loginUser = createAsyncThunk(
  "clinic/loginUser",
  async (data, thunkAPI) => {
    try {
      return await clinicApi.login(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Đăng nhập thất bại")
      );
    }
  }
);

export const registerPatient = createAsyncThunk(
  "clinic/registerPatient",
  async (data, thunkAPI) => {
    try {
      return await clinicApi.registerPatient(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Đăng ký thất bại")
      );
    }
  }
);

export const fetchDoctorAccounts = createAsyncThunk(
  "clinic/fetchDoctorAccounts",
  async (_, thunkAPI) => {
    try {
      return await clinicApi.getDoctorAccounts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Không thể tải danh sách bác sĩ")
      );
    }
  }
);

export const createDoctorAccount = createAsyncThunk(
  "clinic/createDoctorAccount",
  async (data, thunkAPI) => {
    try {
      return await clinicApi.createDoctor(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Không thể tạo bác sĩ")
      );
    }
  }
);

export const updateDoctorAccount = createAsyncThunk(
  "clinic/updateDoctorAccount",
  async ({ id, data }, thunkAPI) => {
    try {
      await clinicApi.updateDoctor(id, data);
      return { MaTaiKhoan: id, ...data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Không thể cập nhật bác sĩ")
      );
    }
  }
);

export const deleteDoctorAccount = createAsyncThunk(
  "clinic/deleteDoctorAccount",
  async (id, thunkAPI) => {
    try {
      await clinicApi.deleteDoctor(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error ||
        error.message ||
        "Không thể xóa tài khoản bác sĩ"
      );
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  "clinic/fetchAppointments",
  async (_, thunkAPI) => {
    try {
      return await clinicApi.getAppointments();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Không thể tải lịch hẹn")
      );
    }
  }
);

export const fetchPatientStats = createAsyncThunk(
  "clinic/fetchPatientStats",
  async (_, thunkAPI) => {
    try {
      return await clinicApi.getPatientStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Không thể tải thống kê bệnh nhân")
      );
    }
  }
);

export const fetchServiceStats = createAsyncThunk(
  "clinic/fetchServiceStats",
  async (_, thunkAPI) => {
    try {
      return await clinicApi.getServiceStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Không thể tải thống kê dịch vụ")
      );
    }
  }
);

export const fetchDoctorStats = createAsyncThunk(
  "clinic/fetchDoctorStats",
  async (_, thunkAPI) => {
    try {
      return await clinicApi.getDoctorStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Không thể tải thống kê bác sĩ")
      );
    }
  }
);

export const fetchTimeSlotStats = createAsyncThunk(
  "clinic/fetchTimeSlotStats",
  async (_, thunkAPI) => {
    try {
      return await clinicApi.getTimeSlotStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Không thể tải thống kê khung giờ")
      );
    }
  }
);

const initialState = {
  user: null,
  doctors: [],
  appointments: [],
  patientStats: [],
  serviceStats: [],
  doctorStats: [],
  timeSlotStats: [],
  loading: false,
  error: null,
  message: null,
};

const clinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },

    clearClinicMessage: (state) => {
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Đăng ký thành công";
      })
      .addCase(fetchDoctorAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(createDoctorAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Tạo bác sĩ thành công";
      })
      .addCase(updateDoctorAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.map((doctor) =>
          doctor.MaTaiKhoan === action.payload.MaTaiKhoan
            ? { ...doctor, ...action.payload }
            : doctor
        );
        state.message = "Cập nhật bác sĩ thành công";
      })
      .addCase(deleteDoctorAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.filter(
          (doctor) => doctor.MaTaiKhoan !== action.payload
        );
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPatientStats.fulfilled, (state, action) => {
        state.loading = false;
        state.patientStats = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchServiceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceStats = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDoctorStats.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorStats = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTimeSlotStats.fulfilled, (state, action) => {
        state.loading = false;
        state.timeSlotStats = Array.isArray(action.payload) ? action.payload : [];
      })
      .addMatcher(
        (action) => action.type.startsWith("clinic/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.message = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("clinic/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Có lỗi xảy ra";
        }
      );
  },
});

export const {
  logout,
  clearClinicMessage,
} = clinicSlice.actions;

export default clinicSlice.reducer;
