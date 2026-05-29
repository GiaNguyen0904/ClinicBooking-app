const appointmentService = require("../services/appointment.service");

const appointmentController = {
  async getAvailableSlots(req, res) {
    try {
      const { MaBacSi, Ngay } = req.query;
      if (!MaBacSi || !Ngay) return res.status(400).json({ error: "Thiếu MaBacSi hoặc Ngay" });
      const result = await appointmentService.getAvailableSlots(MaBacSi, Ngay);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createAppointment(req, res) {
    try {
      // Nếu bệnh nhân tự đặt, gắn MaBenhNhan từ token
      const data = { ...req.body };
      if (req.user.VaiTro === "Khách hàng" && req.user.MaHoSo) {
        data.MaBenhNhan = req.user.MaHoSo;
      }
      const result = await appointmentService.createAppointment(data);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAllAppointments(req, res) {
    try {
      const result = await appointmentService.getAllAppointments(req.query);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAppointmentById(req, res) {
    try {
      const result = await appointmentService.getAppointmentById(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async getAppointmentsByPatient(req, res) {
    try {
      const MaBenhNhan = req.params.MaBenhNhan;
      // Bệnh nhân chỉ xem lịch của mình
      if (req.user.VaiTro === "Khách hàng" && req.user.MaHoSo !== parseInt(MaBenhNhan)) {
        return res.status(403).json({ error: "Không có quyền truy cập" });
      }
      const result = await appointmentService.getAppointmentsByPatient(MaBenhNhan);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateAppointmentStatus(req, res) {
    try {
      const result = await appointmentService.updateAppointmentStatus(req.params.id, req.body.TrangThai);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async cancelAppointment(req, res) {
    try {
      const result = await appointmentService.cancelAppointment(
        req.params.id,
        req.user.MaHoSo,
        req.user.VaiTro
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async rescheduleAppointment(req, res) {
    try {
      const result = await appointmentService.rescheduleAppointment(
        req.params.id,
        req.body,
        req.user.MaHoSo,
        req.user.VaiTro
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = appointmentController;
