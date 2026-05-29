import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import scheduleApi from "../api/scheduleApi";

export const fetchSchedules =
  createAsyncThunk(
    "schedule/fetchSchedules",
    async (_, thunkAPI) => {
      try {
        return await scheduleApi.getSchedules();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );

export const fetchAvailableSchedules =
  createAsyncThunk(
    "schedule/fetchAvailableSchedules",
    async (date, thunkAPI) => {
      try {
        return await scheduleApi.getAvailableSchedules(
          date
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );

export const createScheduleThunk =
  createAsyncThunk(
    "schedule/createSchedule",
    async (data, thunkAPI) => {
      try {
        return await scheduleApi.createSchedule(
          data
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );

export const updateScheduleThunk =
  createAsyncThunk(
    "schedule/updateSchedule",
    async (
      { id, data },
      thunkAPI
    ) => {
      try {
        return await scheduleApi.updateSchedule(
          id,
          data
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );

export const deleteScheduleThunk =
  createAsyncThunk(
    "schedule/deleteSchedule",
    async (id, thunkAPI) => {
      try {
        await scheduleApi.deleteSchedule(
          id
        );

        return id;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message
        );
      }
    }
  );

const initialState = {
  schedules: [],
  availableSchedules: [],
  loading: false,
  error: null,
};


const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];
      })

      // AVAILABLE
      .addCase(fetchAvailableSchedules.fulfilled, (state, action) => {
        state.availableSchedules = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];
      })

      // ERROR SAFE
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      });
  },
});

export default scheduleSlice.reducer;