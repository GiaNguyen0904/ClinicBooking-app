const pool = require("../config/db");

const createSchedule = async (
  data
) => {
  const {
    MaBacSi,
    Ngay,
    GioBatDau,
    GioKetThuc,
    SoLuongToiDa,
  } = data;

  const [result] = await pool.promise().query(
    `INSERT INTO KhungGio (
        MaBacSi,
        Ngay,
        GioBatDau,
        GioKetThuc,
        SoLuongToiDa
     )
     VALUES (?, ?, ?, ?, ?)`,
    [
      MaBacSi,
      Ngay,
      GioBatDau,
      GioKetThuc,
      SoLuongToiDa,
    ]
  );

  return result;
};

const updateSchedule = async (
  scheduleId,
  data
) => {
  const {
    MaBacSi,
    Ngay,
    GioBatDau,
    GioKetThuc,
    SoLuongToiDa,
  } = data;

  const [result] = await pool.promise().query(
    `UPDATE KhungGio
     SET
        MaBacSi = ?,
        Ngay = ?,
        GioBatDau = ?,
        GioKetThuc = ?,
        SoLuongToiDa = ?
     WHERE MaKhungGio = ?`,
    [
      MaBacSi,
      Ngay,
      GioBatDau,
      GioKetThuc,
      SoLuongToiDa,
      scheduleId,  
    ]
  );

  return result;
};

const deleteSchedule = async (
  scheduleId
) => {
  const [result] = await pool.promise().query(
    `DELETE FROM KhungGio
     WHERE MaKhungGio = ?`,
    [scheduleId]
  );  
  return result;
};

const findScheduleById = async (
  scheduleId
) => {
  const [rows] = await pool.promise().query(
    `SELECT *
     FROM KhungGio
     WHERE MaKhungGio = ?`,
    [scheduleId]
  );

  return rows[0];
};

const getSchedules = async () => {
  const [rows] = await pool.promise().query(
    `SELECT *
     FROM KhungGio
     ORDER BY Ngay ASC, GioBatDau ASC`
  );

  return rows;
};

const checkScheduleOverlap = async (
  doctorId,
  date,
  startTime,
  endTime,
  excludeId = null
) => {
  let query = `
    SELECT *
    FROM KhungGio
    WHERE MaBacSi = ?
    AND Ngay = ?
    AND (
      GioBatDau < ?
      AND GioKetThuc > ?
    )`; 
  const params = [
    doctorId,
    date,
    endTime,
    startTime,
  ];

  if (excludeId) {
    query += ` AND MaKhungGio != ?`;
    params.push(excludeId);
  }

  const [rows] = await pool.promise().query(
    query,
    params
  );

  return rows;
};

const getAvailableSchedules = async (
  date
) => {
  const [rows] = await pool.promise().query(
    `SELECT
        kg.MaKhungGio,
        kg.MaBacSi,
        kg.Ngay,
        kg.GioBatDau,
        kg.GioKetThuc,
        kg.SoLuongToiDa,

        COUNT(lh.MaLichHen) AS SoLuongDaDat,

        (
          kg.SoLuongToiDa - COUNT(lh.MaLichHen)
        ) AS SoLuongConLai

     FROM KhungGio kg
     LEFT JOIN LichHen lh
     ON kg.MaKhungGio = lh.MaKhungGio
     AND lh.TrangThai IN (
        'Chờ xác nhận',
        'Đã xác nhận',
        'Đang thực hiện'
     )

     WHERE kg.Ngay = ?

     GROUP BY kg.MaKhungGio

     HAVING SoLuongConLai > 0

     ORDER BY kg.GioBatDau ASC`,
    [date]
  );

  return rows;
};

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  findScheduleById,
  getSchedules,
  checkScheduleOverlap,
  getAvailableSchedules,
};