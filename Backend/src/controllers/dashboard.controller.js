const dashboardService = require("../services/dashboard.service");

const dashboardController = {
  async getDashboard(req, res) {
    try {
      const result = await dashboardService.getDashboard();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getMonthlyStats(req, res) {
    try {
      const { nam, thang } = req.query;
      const result = await dashboardService.getMonthlyStats(nam, thang);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getServiceStats(req, res) {
    try {
      const result = await dashboardService.getServiceStats();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = dashboardController;
