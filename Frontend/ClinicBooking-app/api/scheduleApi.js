import axios from "axios";

const BASE_URL =
  "http://10.106.39.177:5555/api/schedules";

const getSchedules = async () => {
  const response = await axios.get(
    BASE_URL
  );

  return response.data;
};

const getAvailableSchedules =
  async (date) => {
    const response = await axios.get(
      `${BASE_URL}/available`,
      {
        params: { date },
      }
    );

    return response.data;
  };

const createSchedule = async (
  data
) => {
  const response = await axios.post(
    BASE_URL,
    data
  );

  return response.data;
};

const updateSchedule = async (
  id,
  data
) => {
  const response = await axios.put(
    `${BASE_URL}/${id}`,
    data
  );

  return response.data;
};

const deleteSchedule = async (
  id
) => {
  const response = await axios.delete(
    `${BASE_URL}/${id}`
  );

  return response.data;
};

export default {
  getSchedules,
  getAvailableSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};