const express = require('express');
const router = express.Router();

const medicalRecordController = require('../controllers/medical-record.controller');

router.get('/patient/:MaBenhNhan', medicalRecordController.getMedicalRecordsByPatient);
router.get('/doctor/:MaBacSi', medicalRecordController.getMedicalRecordsByDoctor);

router.get('/:id', medicalRecordController.getMedicalRecordById);
router.post('/', medicalRecordController.createMedicalRecord);
router.put('/:id', medicalRecordController.updateMedicalRecord);
router.delete('/:id', medicalRecordController.deleteMedicalRecord);

router.post('/:id/prescriptions', medicalRecordController.addPrescription);
router.put('/prescriptions/:MaDonThuoc', medicalRecordController.updatePrescription);
router.delete('/prescriptions/:MaDonThuoc', medicalRecordController.deletePrescription);

router.post('/:id/test-results', medicalRecordController.addTestResult);
router.put('/test-results/:MaKetQua', medicalRecordController.updateTestResult);
router.delete('/test-results/:MaKetQua', medicalRecordController.deleteTestResult);

module.exports = router;