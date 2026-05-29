const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/schedule.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

// Public: xem lịch trống
router.get("/available", scheduleController.getAvailableSchedules);
router.get("/doctor/:MaBacSi", scheduleController.getSchedulesByDoctor);
router.get("/:id/available", scheduleController.checkScheduleAvailable);

// Yêu cầu đăng nhập
router.use(authenticate);

router.get("/", scheduleController.getSchedules);
router.post("/", authorize("ADMIN", "Bác sĩ"), scheduleController.createSchedule);
router.put("/:id", authorize("ADMIN", "Bác sĩ"), scheduleController.updateSchedule);
router.delete("/:id", authorize("ADMIN"), scheduleController.deleteSchedule);

module.exports = router;
