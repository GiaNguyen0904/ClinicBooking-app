const db = require("../config/db");

const query = (sql, params = []) => db.query(sql, params).then(([rows]) => rows);

const medicalRecordModel = {
  getPatientById: (MaBenhNhan) => query(`SELECT MaBenhNhan, HoTen FROM BenhNhan WHERE MaBenhNhan = ?`, [MaBenhNhan]),
  getDoctorById: (MaBacSi) => query(`SELECT MaBacSi, HoTen FROM BacSi WHERE MaBacSi = ?`, [MaBacSi]),

  createMedicalRecord({ MaBenhNhan, MaBacSi, ChanDoan, NgayLap }) {
    return db.query(
      `INSERT INTO BenhAn (MaBenhNhan, MaBacSi, ChanDoan, NgayLap) VALUES (?, ?, ?, ?)`,
      [MaBenhNhan, MaBacSi, ChanDoan || null, NgayLap || new Date()]
    ).then(([r]) => r);
  },

  getMedicalRecordById: (MaBenhAn) => query(`
    SELECT ba.MaBenhAn, ba.ChanDoan, ba.NgayLap,
           bn.MaBenhNhan, bn.HoTen AS TenBenhNhan, bn.NgaySinh, bn.GioiTinh, bn.SoDienThoai AS SDTBenhNhan, bn.DiaChi,
           bs.MaBacSi, bs.HoTen AS TenBacSi, bs.ChuyenKhoa, bs.SoDienThoai AS SDTBacSi, bs.Email AS EmailBacSi
    FROM BenhAn ba
    JOIN BenhNhan bn ON ba.MaBenhNhan = bn.MaBenhNhan
    JOIN BacSi bs ON ba.MaBacSi = bs.MaBacSi
    WHERE ba.MaBenhAn = ?
  `, [MaBenhAn]),

  getMedicalRecordsByPatient: (MaBenhNhan) => query(`
    SELECT ba.MaBenhAn, ba.ChanDoan, ba.NgayLap,
           bs.MaBacSi, bs.HoTen AS TenBacSi, bs.ChuyenKhoa
    FROM BenhAn ba JOIN BacSi bs ON ba.MaBacSi = bs.MaBacSi
    WHERE ba.MaBenhNhan = ? ORDER BY ba.NgayLap DESC, ba.MaBenhAn DESC
  `, [MaBenhNhan]),

  getMedicalRecordsByDoctor: (MaBacSi) => query(`
    SELECT ba.MaBenhAn, ba.ChanDoan, ba.NgayLap,
           bn.MaBenhNhan, bn.HoTen AS TenBenhNhan, bn.SoDienThoai AS SDTBenhNhan
    FROM BenhAn ba JOIN BenhNhan bn ON ba.MaBenhNhan = bn.MaBenhNhan
    WHERE ba.MaBacSi = ? ORDER BY ba.NgayLap DESC, ba.MaBenhAn DESC
  `, [MaBacSi]),

  updateMedicalRecord: (MaBenhAn, { ChanDoan, NgayLap }) =>
    db.query(`UPDATE BenhAn SET ChanDoan=?, NgayLap=? WHERE MaBenhAn=?`, [ChanDoan || null, NgayLap || new Date(), MaBenhAn]),

  deleteMedicalRecord: (MaBenhAn) => db.query(`DELETE FROM BenhAn WHERE MaBenhAn = ?`, [MaBenhAn]),

  createPrescription: ({ MaBenhAn, NoiDung, NgayKe }) =>
    db.query(`INSERT INTO DonThuoc (MaBenhAn, NoiDung, NgayKe) VALUES (?, ?, ?)`,
      [MaBenhAn, NoiDung || null, NgayKe || new Date()]).then(([r]) => r),

  getPrescriptionsByRecord: (MaBenhAn) =>
    query(`SELECT MaDonThuoc, MaBenhAn, NoiDung, NgayKe FROM DonThuoc WHERE MaBenhAn = ? ORDER BY NgayKe DESC`, [MaBenhAn]),

  updatePrescription: (MaDonThuoc, { NoiDung, NgayKe }) =>
    db.query(`UPDATE DonThuoc SET NoiDung=?, NgayKe=? WHERE MaDonThuoc=?`, [NoiDung || null, NgayKe || new Date(), MaDonThuoc]),

  deletePrescription: (MaDonThuoc) => db.query(`DELETE FROM DonThuoc WHERE MaDonThuoc = ?`, [MaDonThuoc]),

  createTestResult: ({ MaBenhAn, TenXetNghiem, KetQua, NgayXetNghiem }) =>
    db.query(`INSERT INTO KetQuaXetNghiem (MaBenhAn, TenXetNghiem, KetQua, NgayXetNghiem) VALUES (?, ?, ?, ?)`,
      [MaBenhAn, TenXetNghiem || null, KetQua || null, NgayXetNghiem || new Date()]).then(([r]) => r),

  getTestResultsByRecord: (MaBenhAn) =>
    query(`SELECT MaKetQua, MaBenhAn, TenXetNghiem, KetQua, NgayXetNghiem FROM KetQuaXetNghiem WHERE MaBenhAn = ? ORDER BY NgayXetNghiem DESC`, [MaBenhAn]),

  updateTestResult: (MaKetQua, { TenXetNghiem, KetQua, NgayXetNghiem }) =>
    db.query(`UPDATE KetQuaXetNghiem SET TenXetNghiem=?, KetQua=?, NgayXetNghiem=? WHERE MaKetQua=?`,
      [TenXetNghiem || null, KetQua || null, NgayXetNghiem || new Date(), MaKetQua]),

  deleteTestResult: (MaKetQua) => db.query(`DELETE FROM KetQuaXetNghiem WHERE MaKetQua = ?`, [MaKetQua]),
};

module.exports = medicalRecordModel;
