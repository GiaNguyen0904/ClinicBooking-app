const db = require("../config/db");

const createSchedule = async (data) => {
  const { MaBacSi, Ngay, GioBatDau, GioKetThuc, SoLuongToiDa } = data;
  const [result] = await db.query(
    `INSERT INTO KhungGio (MaBacSi, Ngay, GioBatDau, GioKetThuc, SoLuongToiDa) VALUES (?, ?, ?, ?, ?)`,
    [MaBacSi, Ngay, GioBatDau, GioKetThuc, SoLuongToiDa]
  );
  return result;
};

const updateSchedule = async (scheduleId, data) => {
  const { MaBacSi, Ngay, GioBatDau, GioKetThuc, SoLuongToiDa } = data;
  const [result] = await db.query(
    `UPDATE KhungGio SET MaBacSi=?, Ngay=?, GioBatDau=?, GioKetThuc=?, SoLuongToiDa=? WHERE MaKhungGio=?`,
    [MaBacSi, Ngay, GioBatDau, GioKetThuc, SoLuongToiDa, scheduleId]
  );
  return result;
};

const deleteSchedule = async (scheduleId) => {
  const [result] = await db.query(`DELETE FROM KhungGio WHERE MaKhungGio = ?`, [scheduleId]);
  return result;
};

const findScheduleById = async (scheduleId) => {
  const [rows] = await db.query(`SELECT * FROM KhungGio WHERE MaKhungGio = ?`, [scheduleId]);
  return rows[0];
};

const getSchedules = async (filter = {}) => {
  let sql = `
    SELECT kg.*, bs.HoTen AS TenBacSi, bs.ChuyenKhoa
    FROM KhungGio kg
    JOIN BacSi bs ON kg.MaBacSi = bs.MaBacSi
    WHERE 1=1
  `;
  const params = [];
  if (filter.MaBacSi) { sql += ` AND kg.MaBacSi = ?`; params.push(filter.MaBacSi); }
  if (filter.Ngay) { sql += ` AND kg.Ngay = ?`; params.push(filter.Ngay); }
  sql += ` ORDER BY kg.Ngay ASC, kg.GioBatDau ASC`;
  const [rows] = await db.query(sql, params);
  return rows;
};

const getSchedulesByDoctor = async (MaBacSi) => {
  const [rows] = await db.query(
    `SELECT * FROM KhungGio WHERE MaBacSi = ? ORDER BY Ngay ASC, GioBatDau ASC`,
    [MaBacSi]
  );
  return rows;
};

const checkScheduleOverlap = async (doctorId, date, startTime, endTime, excludeId = null) => {
  let sql = `
    SELECT * FROM KhungGio
    WHERE MaBacSi = ? AND Ngay = ?
    AND (GioBatDau < ? AND GioKetThuc > ?)
  `;
  const params = [doctorId, date, endTime, startTime];
  if (excludeId) { sql += ` AND MaKhungGio != ?`; params.push(excludeId); }
  const [rows] = await db.query(sql, params);
  return rows;
};

const getAvailableSchedules = async (date) => {
  const [rows] = await db.query(`
    SELECT kg.MaKhungGio, kg.MaBacSi, bs.HoTen AS TenBacSi, bs.ChuyenKhoa,
           kg.Ngay, kg.GioBatDau, kg.GioKetThuc, kg.SoLuongToiDa,
           COUNT(lh.MaLichHen) AS SoLuongDaDat,
           (kg.SoLuongToiDa - COUNT(lh.MaLichHen)) AS SoLuongConLai
    FROM KhungGio kg
    JOIN BacSi bs ON kg.MaBacSi = bs.MaBacSi
    LEFT JOIN LichHen lh ON kg.MaKhungGio = lh.MaKhungGio
      AND lh.TrangThai IN ('Chờ xác nhận', 'Đã xác nhận', 'Đang thực hiện')
    WHERE kg.Ngay = ?
    GROUP BY kg.MaKhungGio
    HAVING SoLuongConLai > 0
    ORDER BY kg.GioBatDau ASC
  `, [date]);
  return rows;
};

module.exports = {
  createSchedule, updateSchedule, deleteSchedule, findScheduleById,
  getSchedules, getSchedulesByDoctor, checkScheduleOverlap, getAvailableSchedules,
};
