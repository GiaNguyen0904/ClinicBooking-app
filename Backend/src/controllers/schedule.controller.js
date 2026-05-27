const scheduleService = require("../services/schedule.service");

const createSchedule = async (
  req,
  res
) => {
  try {
    const result =
      await scheduleService.createSchedule(
        req.body
      );

    res.status(201).json({
      message: "Tạo khung giờ thành công",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updateSchedule = async (
  req,
  res
) => {
  try {
    const result =
      await scheduleService.updateSchedule(
        req.params.id,
        req.body
      );

    res.status(200).json({
      message: "Cập nhật thành công",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
const deleteSchedule = async (
  req,
  res
) => {
  try {
    await scheduleService.deleteSchedule(
      req.params.id
    );

    res.status(200).json({
      message: "Xóa thành công",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getSchedules = async (
  req,
  res
) => {
  try {
    const schedules =
      await scheduleService.getSchedules();

    res.status(200).json({
      data: schedules,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAvailableSchedules = async (
  req,
  res
) => {
  try {
    const schedules =
      await scheduleService.getAvailableSchedules(
        req.query.date
      );

    res.status(200).json({
      data: schedules,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const checkScheduleAvailable = async (
  req,
  res
) => {
  try {
    const result =
      await scheduleService.checkScheduleAvailable(
        req.params.id
      );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules,
  getAvailableSchedules,
  checkScheduleAvailable,
};