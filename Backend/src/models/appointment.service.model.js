const pool = require("../config/db");

const countAppointmentsBySchedule = async (
  scheduleId
) => {
  const [rows] = await pool.promise().query(
    `SELECT COUNT(*) AS total
     FROM LichHen
     WHERE MaKhungGio = ? AND TrangThai IN ('Chờ xác nhận', 'Đã xác nhận', 'Đang thực hiện')`,
    [scheduleId]
  );

  return rows[0].total;
};

module.exports = {
  countAppointmentsBySchedule,
};