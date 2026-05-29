import axios from "axios";

const BASE_URL =
  "http://10.106.39.177:5555/api/appointments";

const getData = async (request) => {
  const response = await request;
  return response.data;
};

const getAppointments = async (params = {}) => {
  return getData(
    axios.get(BASE_URL, {
      params,
    })
  );
};

const getAppointmentById = async (id) => {
  return getData(
    axios.get(`${BASE_URL}/${id}`)
  );
};

const getAppointmentsByPatient = async (MaBenhNhan) => {
  return getData(
    axios.get(`${BASE_URL}/patient/${MaBenhNhan}`)
  );
};

const getAvailableSlots = async ({
  MaBacSi,
  Ngay,
}) => {
  return getData(
    axios.get(`${BASE_URL}/slots/available`, {
      params: {
        MaBacSi,
        Ngay,
      },
    })
  );
};

const createAppointment = async (data) => {
  return getData(
    axios.post(BASE_URL, data)
  );
};

const updateAppointmentStatus = async (
  id,
  TrangThai
) => {
  return getData(
    axios.patch(`${BASE_URL}/${id}/status`, {
      TrangThai,
    })
  );
};

const cancelAppointment = async (id) => {
  return getData(
    axios.patch(`${BASE_URL}/${id}/cancel`)
  );
};

export default {
  getAppointments,
  getAppointmentById,
  getAppointmentsByPatient,
  getAvailableSlots,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
};
