const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medical-record.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/patient/:MaBenhNhan", medicalRecordController.getMedicalRecordsByPatient);
router.get("/doctor/:MaBacSi", authorize("ADMIN", "Bác sĩ"), medicalRecordController.getMedicalRecordsByDoctor);
router.get("/:id", medicalRecordController.getMedicalRecordById);
router.post("/", authorize("Bác sĩ", "ADMIN"), medicalRecordController.createMedicalRecord);
router.put("/:id", authorize("Bác sĩ", "ADMIN"), medicalRecordController.updateMedicalRecord);
router.delete("/:id", authorize("ADMIN"), medicalRecordController.deleteMedicalRecord);

router.post("/:id/prescriptions", authorize("Bác sĩ", "ADMIN"), medicalRecordController.addPrescription);
router.put("/prescriptions/:MaDonThuoc", authorize("Bác sĩ", "ADMIN"), medicalRecordController.updatePrescription);
router.delete("/prescriptions/:MaDonThuoc", authorize("ADMIN"), medicalRecordController.deletePrescription);

router.post("/:id/test-results", authorize("Bác sĩ", "ADMIN"), medicalRecordController.addTestResult);
router.put("/test-results/:MaKetQua", authorize("Bác sĩ", "ADMIN"), medicalRecordController.updateTestResult);
router.delete("/test-results/:MaKetQua", authorize("ADMIN"), medicalRecordController.deleteTestResult);

module.exports = router;
