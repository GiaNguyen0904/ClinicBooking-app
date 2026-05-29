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
    .addCase(
      fetchSchedules.pending,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    )

    .addCase(
      fetchSchedules.fulfilled,
      (state, action) => {
        state.loading = false;

        state.schedules =
          Array.isArray(
            action.payload?.data
          )
            ? action.payload.data
            : [];
      }
    )

    .addCase(
      fetchSchedules.rejected,
      (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Error";
      }
    )

    // AVAILABLE
    .addCase(
      fetchAvailableSchedules.fulfilled,
      (state, action) => {
        state.availableSchedules =
          Array.isArray(
            action.payload?.data
          )
            ? action.payload.data
            : [];
      }
    )

    // CREATE
 .addCase(
  createScheduleThunk.fulfilled,
  (state) => {
    state.loading = false;
  }
)

    // UPDATE
    .addCase(
      updateScheduleThunk.fulfilled,
      (state, action) => {
        const updatedSchedule =
          action.payload?.data;

        const index =
          state.schedules.findIndex(
            (item) =>
              item.MaKhungGio ===
              updatedSchedule.MaKhungGio
          );

        if (index !== -1) {
          state.schedules[index] =
            updatedSchedule;
        }
      }
    )

    // DELETE
    .addCase(
      deleteScheduleThunk.fulfilled,
      (state, action) => {
        state.schedules =
          state.schedules.filter(
            (item) =>
              item.MaKhungGio !==
              action.payload
          );
      }
    );
},
});

export default scheduleSlice.reducer;