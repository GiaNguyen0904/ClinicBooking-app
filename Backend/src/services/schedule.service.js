const doctorModel = require("../models/doctor.service.model");
const scheduleModel = require("../models/schedule.model");
const appointmentModel = require("../models/appointment.service.model");

// Bác sĩ chỉ có thể cập nhật lịch trước ít nhất 4 ngày (không được cập nhật lịch cũ trước 2 ngày)
const MIN_DAYS_BEFORE_UPDATE = 4;

const createSchedule = async (data) => {
  const { MaBacSi, Ngay, GioBatDau, GioKetThuc, SoLuongToiDa } = data;

  const doctor = await doctorModel.findDoctorById(MaBacSi);
  if (!doctor) throw new Error("Bác sĩ không tồn tại");

  if (GioBatDau >= GioKetThuc) throw new Error("Giờ bắt đầu phải nhỏ hơn giờ kết thúc");

  // Kiểm tra lịch phải ít nhất 4 ngày từ hôm nay
  const scheduleDate = new Date(Ngay);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = (scheduleDate - today) / (1000 * 60 * 60 * 24);
  if (diffDays < MIN_DAYS_BEFORE_UPDATE) {
    throw new Error(`Lịch làm việc phải được tạo trước ít nhất ${MIN_DAYS_BEFORE_UPDATE} ngày`);
  }

  const overlapSchedules = await scheduleModel.checkScheduleOverlap(MaBacSi, Ngay, GioBatDau, GioKetThuc);
  if (overlapSchedules.length > 0) throw new Error("Bác sĩ đã có lịch trong thời gian này");

  return await scheduleModel.createSchedule({ MaBacSi, Ngay, GioBatDau, GioKetThuc, SoLuongToiDa });
};

const updateSchedule = async (scheduleId, data, doctorId = null) => {
  const oldSchedule = await scheduleModel.findScheduleById(scheduleId);
  if (!oldSchedule) throw new Error("Khung giờ không tồn tại");

  // Nếu bác sĩ gọi, chỉ được sửa lịch của mình
  if (doctorId && oldSchedule.MaBacSi !== doctorId) {
    throw new Error("Bạn không có quyền chỉnh sửa khung giờ này");
  }

  // Kiểm tra thời gian tối thiểu
  const scheduleDate = new Date(oldSchedule.Ngay);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = (scheduleDate - today) / (1000 * 60 * 60 * 24);
  if (diffDays < MIN_DAYS_BEFORE_UPDATE) {
    throw new Error(`Chỉ có thể cập nhật lịch trước ít nhất ${MIN_DAYS_BEFORE_UPDATE} ngày`);
  }

  const totalAppointments = await appointmentModel.countAppointmentsBySchedule(scheduleId);
  if (totalAppointments > 0) throw new Error("Khung giờ đã có lịch hẹn, không thể sửa");

  const overlapSchedules = await scheduleModel.checkScheduleOverlap(
    data.MaBacSi || oldSchedule.MaBacSi,
    data.Ngay || oldSchedule.Ngay,
    data.GioBatDau || oldSchedule.GioBatDau,
    data.GioKetThuc || oldSchedule.GioKetThuc,
    scheduleId
  );
  if (overlapSchedules.length > 0) throw new Error("Bác sĩ đã có lịch trong thời gian này");

  return await scheduleModel.updateSchedule(scheduleId, { ...oldSchedule, ...data });
};

const deleteSchedule = async (scheduleId) => {
  const schedule = await scheduleModel.findScheduleById(scheduleId);
  if (!schedule) throw new Error("Khung giờ không tồn tại");

  const totalAppointments = await appointmentModel.countAppointmentsBySchedule(scheduleId);
  if (totalAppointments > 0) throw new Error("Không thể xóa khung giờ đã có lịch hẹn");

  return await scheduleModel.deleteSchedule(scheduleId);
};

const getSchedules = async (filter = {}) => {
  return await scheduleModel.getSchedules(filter);
};

const getAvailableSchedules = async (date) => {
  return await scheduleModel.getAvailableSchedules(date);
};

const getSchedulesByDoctor = async (MaBacSi) => {
  return await scheduleModel.getSchedulesByDoctor(MaBacSi);
};

const checkScheduleAvailable = async (scheduleId) => {
  const schedule = await scheduleModel.findScheduleById(scheduleId);
  if (!schedule) throw new Error("Khung giờ không tồn tại");

  const totalAppointments = await appointmentModel.countAppointmentsBySchedule(scheduleId);
  const remaining = schedule.SoLuongToiDa - totalAppointments;

  return { available: remaining > 0, remaining, schedule };
};

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules,
  getAvailableSchedules,
  getSchedulesByDoctor,
  checkScheduleAvailable,
};
