const db = require("../config/db");

const dashboardModel = {
  getAppointmentsToday(Ngay) {
    return db.query(
      `SELECT lh.MaLichHen, lh.NgayHen, lh.TrangThai,
              bn.HoTen AS TenBenhNhan, bn.SoDienThoai AS SDTBenhNhan,
              bs.HoTen AS TenBacSi, bs.ChuyenKhoa,
              kg.GioBatDau, kg.GioKetThuc
       FROM LichHen lh
       JOIN BenhNhan bn ON lh.MaBenhNhan = bn.MaBenhNhan
       JOIN BacSi bs ON lh.MaBacSi = bs.MaBacSi
       LEFT JOIN KhungGio kg ON lh.MaKhungGio = kg.MaKhungGio
       WHERE lh.NgayHen = ?
       ORDER BY kg.GioBatDau ASC`,
      [Ngay]
    );
  },

  countByStatus(Ngay) {
    return db.query(
      `SELECT TrangThai, COUNT(*) AS SoLuong
       FROM LichHen
       WHERE NgayHen = ?
       GROUP BY TrangThai`,
      [Ngay]
    );
  },

  getPendingAppointments() {
    return db.query(
      `SELECT lh.MaLichHen, lh.NgayHen, lh.TrangThai,
              bn.HoTen AS TenBenhNhan, bn.SoDienThoai,
              bs.HoTen AS TenBacSi,
              kg.GioBatDau, kg.GioKetThuc
       FROM LichHen lh
       JOIN BenhNhan bn ON lh.MaBenhNhan = bn.MaBenhNhan
       JOIN BacSi bs ON lh.MaBacSi = bs.MaBacSi
       LEFT JOIN KhungGio kg ON lh.MaKhungGio = kg.MaKhungGio
       WHERE lh.TrangThai = 'Chờ xác nhận'
       ORDER BY lh.NgayHen ASC, kg.GioBatDau ASC`
    );
  },

  getStatsByMonth(Nam, Thang) {
    return db.query(
      `SELECT DAY(NgayHen) AS Ngay, TrangThai, COUNT(*) AS SoLuong
       FROM LichHen
       WHERE YEAR(NgayHen) = ? AND MONTH(NgayHen) = ?
       GROUP BY DAY(NgayHen), TrangThai
       ORDER BY Ngay`,
      [Nam, Thang]
    );
  },

  getServiceUsageStats() {
    return db.query(
      `SELECT dv.TenDichVu, SUM(ctdv.SoLuong) AS TongSuDung
       FROM ChiTietDichVu ctdv
       JOIN DichVu dv ON ctdv.MaDichVu = dv.MaDichVu
       JOIN LichHen lh ON ctdv.MaLichHen = lh.MaLichHen
       WHERE lh.TrangThai = 'Hoàn thành'
       GROUP BY dv.MaDichVu, dv.TenDichVu
       ORDER BY TongSuDung DESC`
    );
  },
};

module.exports = dashboardModel;
