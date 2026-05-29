const userService = require("../services/user.service");

const userController = {
  // POST /api/users/register
  async initiateRegister(req, res) {
    try {
      const result = await userService.initiateRegister(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // POST /api/users/verify-otp
  async verifyRegisterOTP(req, res) {
    try {
      const result = await userService.verifyRegisterOTP(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // POST /api/users/login
  async login(req, res) {
    try {
      const result = await userService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },

  // GET /api/users/me
  async getProfile(req, res) {
    try {
      const result = await userService.getProfile(req.user.MaTaiKhoan, req.user.VaiTro);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  // PUT /api/users/me
  async updateProfile(req, res) {
    try {
      const result = await userService.updateProfile(req.user.MaTaiKhoan, req.user.VaiTro, req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // GET /api/users/doctors
  async getAllDoctors(req, res) {
    try {
      const result = await userService.getAllDoctors();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/users/doctors/:id
  async getDoctorById(req, res) {
    try {
      const result = await userService.getDoctorById(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },
};

module.exports = userController;
