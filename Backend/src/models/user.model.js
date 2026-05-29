const db = require("../config/db");

const userModel = {
  // TaiKhoan
  findByUsername(TenDangNhap) {
    return db.query(`SELECT * FROM TaiKhoan WHERE TenDangNhap = ?`, [TenDangNhap]);
  },

  findById(MaTaiKhoan) {
    return db.query(`SELECT MaTaiKhoan, TenDangNhap, VaiTro FROM TaiKhoan WHERE MaTaiKhoan = ?`, [MaTaiKhoan]);
  },

  createAccount({ TenDangNhap, MatKhau, VaiTro }) {
    return db.query(
      `INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (?, ?, ?)`,
      [TenDangNhap, MatKhau, VaiTro]
    );
  },

  // BenhNhan
  createBenhNhan({ HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, MaTaiKhoan }) {
    return db.query(
      `INSERT INTO BenhNhan (HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, MaTaiKhoan) VALUES (?, ?, ?, ?, ?, ?)`,
      [HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, MaTaiKhoan]
    );
  },

  findBenhNhanByTaiKhoan(MaTaiKhoan) {
    return db.query(
      `SELECT bn.*, tk.TenDangNhap, tk.VaiTro
       FROM BenhNhan bn
       JOIN TaiKhoan tk ON bn.MaTaiKhoan = tk.MaTaiKhoan
       WHERE bn.MaTaiKhoan = ?`,
      [MaTaiKhoan]
    );
  },

  updateBenhNhan(MaBenhNhan, { HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi }) {
    return db.query(
      `UPDATE BenhNhan SET HoTen=?, NgaySinh=?, GioiTinh=?, SoDienThoai=?, DiaChi=? WHERE MaBenhNhan=?`,
      [HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, MaBenhNhan]
    );
  },

  // BacSi
  findBacSiByTaiKhoan(MaTaiKhoan) {
    return db.query(
      `SELECT bs.*, tk.TenDangNhap, tk.VaiTro, pk.TenPhongKham
       FROM BacSi bs
       JOIN TaiKhoan tk ON bs.MaTaiKhoan = tk.MaTaiKhoan
       LEFT JOIN PhongKham pk ON bs.MaPhongKham = pk.MaPhongKham
       WHERE bs.MaTaiKhoan = ?`,
      [MaTaiKhoan]
    );
  },

  getAllBacSi() {
    return db.query(
      `SELECT bs.MaBacSi, bs.HoTen, bs.SoDienThoai, bs.Email, bs.ChuyenKhoa,
              pk.TenPhongKham
       FROM BacSi bs
       LEFT JOIN PhongKham pk ON bs.MaPhongKham = pk.MaPhongKham
       ORDER BY bs.HoTen`
    );
  },

  getBacSiById(MaBacSi) {
    return db.query(
      `SELECT bs.*, pk.TenPhongKham, pk.DiaChi AS DiaChiPhongKham
       FROM BacSi bs
       LEFT JOIN PhongKham pk ON bs.MaPhongKham = pk.MaPhongKham
       WHERE bs.MaBacSi = ?`,
      [MaBacSi]
    );
  },

  // OTP (lưu trong bảng tạm - dùng Map in-memory cho đơn giản)
};

module.exports = userModel;
