const dashboardModel = require("../models/dashboard.model");

const dashboardService = {
  async getDashboard() {
    const today = new Date().toISOString().slice(0, 10);

    const [todayAppointments] = await dashboardModel.getAppointmentsToday(today);
    const [statusCounts] = await dashboardModel.countByStatus(today);
    const [pending] = await dashboardModel.getPendingAppointments();

    const statusMap = {};
    statusCounts.forEach((row) => {
      statusMap[row.TrangThai] = row.SoLuong;
    });

    return {
      ngay: today,
      lichHenHomNay: todayAppointments,
      thongKeTrangThai: statusMap,
      lichChoXacNhan: pending,
    };
  },

  async getMonthlyStats(Nam, Thang) {
    const n = parseInt(Nam) || new Date().getFullYear();
    const t = parseInt(Thang) || new Date().getMonth() + 1;
    const [rows] = await dashboardModel.getStatsByMonth(n, t);
    return rows;
  },

  async getServiceStats() {
    const [rows] = await dashboardModel.getServiceUsageStats();
    return rows;
  },
};

module.exports = dashboardService;
