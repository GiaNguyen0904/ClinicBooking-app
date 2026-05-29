const scheduleService = require("../services/schedule.service");

const createSchedule = async (req, res) => {
  try {
    // Bác sĩ chỉ tạo lịch cho mình
    const data = { ...req.body };
    if (req.user.VaiTro === "Bác sĩ" && req.user.MaHoSo) {
      data.MaBacSi = req.user.MaHoSo;
    }
    const result = await scheduleService.createSchedule(data);
    res.status(201).json({ message: "Tạo khung giờ thành công", data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const doctorId = req.user.VaiTro === "Bác sĩ" ? req.user.MaHoSo : null;
    const result = await scheduleService.updateSchedule(req.params.id, req.body, doctorId);
    res.status(200).json({ message: "Cập nhật thành công", data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    await scheduleService.deleteSchedule(req.params.id);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.getSchedules(req.query);
    res.status(200).json({ data: schedules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchedulesByDoctor = async (req, res) => {
  try {
    const schedules = await scheduleService.getSchedulesByDoctor(req.params.MaBacSi);
    res.status(200).json({ data: schedules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.getAvailableSchedules(req.query.date);
    res.status(200).json({ data: schedules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkScheduleAvailable = async (req, res) => {
  try {
    const result = await scheduleService.checkScheduleAvailable(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createSchedule, updateSchedule, deleteSchedule,
  getSchedules, getSchedulesByDoctor, getAvailableSchedules, checkScheduleAvailable,
};
