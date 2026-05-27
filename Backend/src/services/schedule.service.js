const doctorModel = require("../models/doctor.service.model");
const scheduleModel = require("../models/schedule.model");
const appointmentModel= require("../models/appointment.service.model");

const createSchedule = async (data) => {
  const {
    MaBacSi,
    Ngay,
    GioBatDau,
    GioKetThuc,
    SoLuongToiDa,
  } = data;

  const doctor = await doctorModel.findDoctorById(
    MaBacSi
  );

  if (!doctor) {
    throw new Error("Bác sĩ không tồn tại");
  }

  if (GioBatDau >= GioKetThuc) {
    throw new Error(
      "Giờ bắt đầu phải nhỏ hơn giờ kết thúc"
    );
  }

  const overlapSchedules =
    await scheduleModel.checkScheduleOverlap(
      MaBacSi,
      Ngay,
      GioBatDau,
      GioKetThuc
    );

  if (overlapSchedules.length > 0) {
    throw new Error(
      "Bác sĩ đã có lịch trong thời gian này"
    );
  }

  return await scheduleModel.createSchedule({
    MaBacSi,
    Ngay,
    GioBatDau,
    GioKetThuc,
    SoLuongToiDa,
  });
};

const updateSchedule = async (
  scheduleId,
  data
) => {
  const oldSchedule =
    await scheduleModel.findScheduleById(
      scheduleId
    );

  if (!oldSchedule) {
    throw new Error("Khung giờ không tồn tại");
  }

  const totalAppointments =
    await appointmentModel.countAppointmentsBySchedule(
      scheduleId
    );

  if (totalAppointments > 0) {
    throw new Error(
      "Khung giờ đã có lịch hẹn"
    );
  }

  const overlapSchedules =
    await scheduleModel.checkScheduleOverlap(
      data.MaBacSi,
      data.Ngay,
      data.GioBatDau,
      data.GioKetThuc,
      scheduleId
    );

  if (overlapSchedules.length > 0) {
    throw new Error(
      "Bác sĩ đã có lịch trong thời gian này"
    );
  }

  return await scheduleModel.updateSchedule(
    scheduleId,
    data
  );
};
const deleteSchedule = async (
  scheduleId
) => {
  const schedule =
    await scheduleModel.findScheduleById(
      scheduleId
    );

  if (!schedule) {
    throw new Error("Khung giờ không tồn tại");
  }

  const totalAppointments =
    await appointmentModel.countAppointmentsBySchedule(
      scheduleId
    );

  if (totalAppointments > 0) {
    throw new Error(
      "Không thể xóa khung giờ đã có lịch hẹn"
    );
  }

  return await scheduleModel.deleteSchedule(
    scheduleId
  );
};

const getSchedules = async () => {
  return await scheduleModel.getSchedules();
};

const getAvailableSchedules = async (
  date
) => {
  return await scheduleModel.getAvailableSchedules(
    date
  );
};
const checkScheduleAvailable = async (
  scheduleId
) => {
  const schedule =
    await scheduleModel.findScheduleById(
      scheduleId
    );

  if (!schedule) {
    throw new Error("Khung giờ không tồn tại");
  }

  const totalAppointments =
    await appointmentModel.countAppointmentsBySchedule(
      scheduleId
    );

  const remaining =
    schedule.SoLuongToiDa - totalAppointments;

  return {
    available: remaining > 0,
    remaining,
  };
};

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules,
  getAvailableSchedules,
  checkScheduleAvailable,
};