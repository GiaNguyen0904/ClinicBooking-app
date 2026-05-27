const con = require('../config/db');

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    con.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const appointmentModel = {
  getAvailableSlots(MaBacSi, Ngay) {
    const sql = `
      SELECT kg.MaKhungGio, kg.MaBacSi, bs.HoTen AS TenBacSi,
             kg.Ngay, kg.GioBatDau, kg.GioKetThuc, kg.SoLuongToiDa,
             COUNT(lh.MaLichHen) AS SoLuongDaDat,
             kg.SoLuongToiDa - COUNT(lh.MaLichHen) AS SoLuongConLai
      FROM KhungGio kg
      JOIN BacSi bs ON kg.MaBacSi = bs.MaBacSi
      LEFT JOIN LichHen lh ON kg.MaKhungGio = lh.MaKhungGio AND lh.TrangThai <> 'Đã hủy'
      WHERE kg.MaBacSi = ? AND kg.Ngay = ?
      GROUP BY kg.MaKhungGio, kg.MaBacSi, bs.HoTen, kg.Ngay, kg.GioBatDau, kg.GioKetThuc, kg.SoLuongToiDa
      HAVING SoLuongConLai > 0
      ORDER BY kg.GioBatDau ASC
    `;

    return query(sql, [MaBacSi, Ngay]);
  },

  getPatientById(MaBenhNhan) {
    return query(`SELECT MaBenhNhan FROM BenhNhan WHERE MaBenhNhan = ?`, [MaBenhNhan]);
  },

  getDoctorById(MaBacSi) {
    return query(`SELECT MaBacSi FROM BacSi WHERE MaBacSi = ?`, [MaBacSi]);
  },

  countActiveAppointments(MaBenhNhan) {
    return query(
      `SELECT COUNT(*) AS total FROM LichHen WHERE MaBenhNhan = ? AND TrangThai IN ('Chờ xác nhận', 'Đã xác nhận')`,
      [MaBenhNhan]
    );
  },

  getSlotWithBookedCount(MaKhungGio) {
    const sql = `
      SELECT kg.MaKhungGio, kg.MaBacSi, kg.Ngay, kg.GioBatDau, kg.GioKetThuc, kg.SoLuongToiDa,
             COUNT(lh.MaLichHen) AS SoLuongDaDat
      FROM KhungGio kg
      LEFT JOIN LichHen lh ON kg.MaKhungGio = lh.MaKhungGio AND lh.TrangThai <> 'Đã hủy'
      WHERE kg.MaKhungGio = ?
      GROUP BY kg.MaKhungGio, kg.MaBacSi, kg.Ngay, kg.GioBatDau, kg.GioKetThuc, kg.SoLuongToiDa
    `;

    return query(sql, [MaKhungGio]);
  },

  getServicesByIds(serviceIds) {
    return query(`SELECT MaDichVu FROM DichVu WHERE MaDichVu IN (?)`, [serviceIds]);
  },

  createAppointment({ MaBenhNhan, MaBacSi, MaKhungGio, NgayHen }) {
    return query(
      `INSERT INTO LichHen (MaBenhNhan, MaBacSi, MaKhungGio, NgayHen, TrangThai) VALUES (?, ?, ?, ?, 'Chờ xác nhận')`,
      [MaBenhNhan, MaBacSi, MaKhungGio, NgayHen]
    );
  },

  addAppointmentService(MaLichHen, MaDichVu, SoLuong) {
    return query(`INSERT INTO ChiTietDichVu (MaLichHen, MaDichVu, SoLuong) VALUES (?, ?, ?)`, [
      MaLichHen,
      MaDichVu,
      SoLuong || 1
    ]);
  },

  getAllAppointments(filter = {}) {
    const { Ngay, TrangThai, MaBacSi } = filter;

    let sql = `
      SELECT lh.MaLichHen, lh.NgayHen, lh.TrangThai,
             bn.MaBenhNhan, bn.HoTen AS TenBenhNhan, bn.SoDienThoai AS SDTBenhNhan,
             bs.MaBacSi, bs.HoTen AS TenBacSi, bs.ChuyenKhoa,
             kg.MaKhungGio, kg.GioBatDau, kg.GioKetThuc
      FROM LichHen lh
      JOIN BenhNhan bn ON lh.MaBenhNhan = bn.MaBenhNhan
      JOIN BacSi bs ON lh.MaBacSi = bs.MaBacSi
      LEFT JOIN KhungGio kg ON lh.MaKhungGio = kg.MaKhungGio
      WHERE 1 = 1
    `;

    const params = [];

    if (Ngay) {
      sql += ` AND lh.NgayHen = ?`;
      params.push(Ngay);
    }

    if (TrangThai) {
      sql += ` AND lh.TrangThai = ?`;
      params.push(TrangThai);
    }

    if (MaBacSi) {
      sql += ` AND lh.MaBacSi = ?`;
      params.push(MaBacSi);
    }

    sql += ` ORDER BY lh.NgayHen DESC, kg.GioBatDau DESC`;
    return query(sql, params);
  },

  getAppointmentById(MaLichHen) {
    const sql = `
      SELECT lh.MaLichHen, lh.NgayHen, lh.TrangThai,
             bn.MaBenhNhan, bn.HoTen AS TenBenhNhan, bn.NgaySinh, bn.GioiTinh, bn.SoDienThoai AS SDTBenhNhan, bn.DiaChi,
             bs.MaBacSi, bs.HoTen AS TenBacSi, bs.SoDienThoai AS SDTBacSi, bs.Email, bs.ChuyenKhoa,
             kg.MaKhungGio, kg.Ngay AS NgayLamViec, kg.GioBatDau, kg.GioKetThuc
      FROM LichHen lh
      JOIN BenhNhan bn ON lh.MaBenhNhan = bn.MaBenhNhan
      JOIN BacSi bs ON lh.MaBacSi = bs.MaBacSi
      LEFT JOIN KhungGio kg ON lh.MaKhungGio = kg.MaKhungGio
      WHERE lh.MaLichHen = ?
    `;

    return query(sql, [MaLichHen]);
  },

  getAppointmentServices(MaLichHen) {
    return query(
      `SELECT dv.MaDichVu, dv.TenDichVu, dv.Gia, dv.MoTa, ctdv.SoLuong, dv.Gia * ctdv.SoLuong AS ThanhTien
       FROM ChiTietDichVu ctdv
       JOIN DichVu dv ON ctdv.MaDichVu = dv.MaDichVu
       WHERE ctdv.MaLichHen = ?`,
      [MaLichHen]
    );
  },

  getAppointmentsByPatient(MaBenhNhan) {
    const sql = `
      SELECT lh.MaLichHen, lh.NgayHen, lh.TrangThai,
             bs.HoTen AS TenBacSi, bs.ChuyenKhoa,
             kg.GioBatDau, kg.GioKetThuc
      FROM LichHen lh
      JOIN BacSi bs ON lh.MaBacSi = bs.MaBacSi
      LEFT JOIN KhungGio kg ON lh.MaKhungGio = kg.MaKhungGio
      WHERE lh.MaBenhNhan = ?
      ORDER BY lh.NgayHen DESC, kg.GioBatDau DESC
    `;

    return query(sql, [MaBenhNhan]);
  },

  getAppointmentStatusById(MaLichHen) {
    return query(`SELECT MaLichHen FROM LichHen WHERE MaLichHen = ?`, [MaLichHen]);
  },

  updateAppointmentStatus(MaLichHen, TrangThai) {
    return query(`UPDATE LichHen SET TrangThai = ? WHERE MaLichHen = ?`, [TrangThai, MaLichHen]);
  },

  getAppointmentForCancel(MaLichHen) {
    const sql = `
      SELECT lh.MaLichHen, lh.TrangThai, kg.Ngay, kg.GioBatDau
      FROM LichHen lh
      LEFT JOIN KhungGio kg ON lh.MaKhungGio = kg.MaKhungGio
      WHERE lh.MaLichHen = ?
    `;

    return query(sql, [MaLichHen]);
  },

  cancelAppointment(MaLichHen) {
    return query(`UPDATE LichHen SET TrangThai = 'Đã hủy' WHERE MaLichHen = ?`, [MaLichHen]);
  }
};

module.exports = appointmentModel;