const medicalRecordService = require('../services/medical-record.service');

const medicalRecordController = {
  async createMedicalRecord(req, res) {
    try {
      const result = await medicalRecordService.createMedicalRecord(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getMedicalRecordById(req, res) {
    try {
      const result = await medicalRecordService.getMedicalRecordById(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async getMedicalRecordsByPatient(req, res) {
    try {
      const result = await medicalRecordService.getMedicalRecordsByPatient(req.params.MaBenhNhan);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async getMedicalRecordsByDoctor(req, res) {
    try {
      const result = await medicalRecordService.getMedicalRecordsByDoctor(req.params.MaBacSi);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async updateMedicalRecord(req, res) {
    try {
      const result = await medicalRecordService.updateMedicalRecord(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteMedicalRecord(req, res) {
    try {
      const result = await medicalRecordService.deleteMedicalRecord(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async addPrescription(req, res) {
    try {
      const result = await medicalRecordService.addPrescription(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updatePrescription(req, res) {
    try {
      const result = await medicalRecordService.updatePrescription(req.params.MaDonThuoc, req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deletePrescription(req, res) {
    try {
      const result = await medicalRecordService.deletePrescription(req.params.MaDonThuoc);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async addTestResult(req, res) {
    try {
      const result = await medicalRecordService.addTestResult(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateTestResult(req, res) {
    try {
      const result = await medicalRecordService.updateTestResult(req.params.MaKetQua, req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteTestResult(req, res) {
    try {
      const result = await medicalRecordService.deleteTestResult(req.params.MaKetQua);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = medicalRecordController;