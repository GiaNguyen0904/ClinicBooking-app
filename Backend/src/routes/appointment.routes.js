const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointment.controller');

router.get('/slots/available', appointmentController.getAvailableSlots);
router.get('/patient/:MaBenhNhan', appointmentController.getAppointmentsByPatient);

router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);

router.post('/', appointmentController.createAppointment);

router.patch('/:id/status', appointmentController.updateAppointmentStatus);
router.patch('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;