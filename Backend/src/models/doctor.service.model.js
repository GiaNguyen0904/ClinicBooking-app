const pool = require("../config/db");

const findDoctorById = async (doctorId) => {
  const [rows] = await pool.query(
    `SELECT *
     FROM BacSi
     WHERE MaBacSi = ?`,
    [doctorId]
  );

  return rows[0];
};

module.exports = {
  findDoctorById,
};