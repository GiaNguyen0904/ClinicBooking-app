const pool = require("../config/db");

const countAppointmentsBySchedule = async (
  scheduleId
) => {
  const [rows] = await pool.promise().query(
    `SELECT COUNT(*) AS total
     FROM LichHen
     WHERE MaKhungGio = ?`,
    [scheduleId]
  );

  return rows[0].total;
};

module.exports = {
  countAppointmentsBySchedule,
};