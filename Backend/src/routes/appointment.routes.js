const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

// Public: xem slot trống
router.get("/slots/available", appointmentController.getAvailableSlots);

// Yêu cầu đăng nhập
router.use(authenticate);

router.post("/", authorize("Khách hàng", "ADMIN"), appointmentController.createAppointment);
router.get("/patient/:MaBenhNhan", appointmentController.getAppointmentsByPatient);
router.get("/", authorize("ADMIN", "Bác sĩ"), appointmentController.getAllAppointments);
router.get("/:id", appointmentController.getAppointmentById);

router.patch("/:id/status", authorize("ADMIN", "Bác sĩ"), appointmentController.updateAppointmentStatus);
router.patch("/:id/cancel", appointmentController.cancelAppointment);
router.patch("/:id/reschedule", authorize("Khách hàng", "ADMIN"), appointmentController.rescheduleAppointment);

module.exports = router;
