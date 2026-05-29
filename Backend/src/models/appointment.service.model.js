const db = require("../config/db");

const countAppointmentsBySchedule = async (scheduleId) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM LichHen WHERE MaKhungGio = ? AND TrangThai NOT IN ('Đã hủy')`,
    [scheduleId]
  );
  return rows[0].total;
};

module.exports = { countAppointmentsBySchedule };
