const con = require('../config/db');

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    con.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const medicalRecordModel = {
  getPatientById(MaBenhNhan) {
    return query(`SELECT MaBenhNhan, HoTen FROM BenhNhan WHERE MaBenhNhan = ?`, [MaBenhNhan]);
  },

  getDoctorById(MaBacSi) {
    return query(`SELECT MaBacSi, HoTen FROM BacSi WHERE MaBacSi = ?`, [MaBacSi]);
  },

  createMedicalRecord({ MaBenhNhan, MaBacSi, ChanDoan, NgayLap }) {
    return query(
      `INSERT INTO BenhAn (MaBenhNhan, MaBacSi, ChanDoan, NgayLap) VALUES (?, ?, ?, ?)`,
      [MaBenhNhan, MaBacSi, ChanDoan || null, NgayLap || new Date()]
    );
  },

  getMedicalRecordById(MaBenhAn) {
    const sql = `
      SELECT ba.MaBenhAn, ba.ChanDoan, ba.NgayLap,
             bn.MaBenhNhan, bn.HoTen AS TenBenhNhan, bn.NgaySinh, bn.GioiTinh, bn.SoDienThoai AS SDTBenhNhan, bn.DiaChi,
             bs.MaBacSi, bs.HoTen AS TenBacSi, bs.ChuyenKhoa, bs.SoDienThoai AS SDTBacSi, bs.Email AS EmailBacSi
      FROM BenhAn ba
      JOIN BenhNhan bn ON ba.MaBenhNhan = bn.MaBenhNhan
      JOIN BacSi bs ON ba.MaBacSi = bs.MaBacSi
      WHERE ba.MaBenhAn = ?
    `;

    return query(sql, [MaBenhAn]);
  },

  getMedicalRecordsByPatient(MaBenhNhan) {
    const sql = `
      SELECT ba.MaBenhAn, ba.ChanDoan, ba.NgayLap,
             bs.MaBacSi, bs.HoTen AS TenBacSi, bs.ChuyenKhoa
      FROM BenhAn ba
      JOIN BacSi bs ON ba.MaBacSi = bs.MaBacSi
      WHERE ba.MaBenhNhan = ?
      ORDER BY ba.NgayLap DESC, ba.MaBenhAn DESC
    `;

    return query(sql, [MaBenhNhan]);
  },

  getMedicalRecordsByDoctor(MaBacSi) {
    const sql = `
      SELECT ba.MaBenhAn, ba.ChanDoan, ba.NgayLap,
             bn.MaBenhNhan, bn.HoTen AS TenBenhNhan, bn.SoDienThoai AS SDTBenhNhan
      FROM BenhAn ba
      JOIN BenhNhan bn ON ba.MaBenhNhan = bn.MaBenhNhan
      WHERE ba.MaBacSi = ?
      ORDER BY ba.NgayLap DESC, ba.MaBenhAn DESC
    `;

    return query(sql, [MaBacSi]);
  },

  updateMedicalRecord(MaBenhAn, { ChanDoan, NgayLap }) {
    return query(`UPDATE BenhAn SET ChanDoan = ?, NgayLap = ? WHERE MaBenhAn = ?`, [
      ChanDoan || null,
      NgayLap || new Date(),
      MaBenhAn
    ]);
  },

  deleteMedicalRecord(MaBenhAn) {
    return query(`DELETE FROM BenhAn WHERE MaBenhAn = ?`, [MaBenhAn]);
  },

  createPrescription({ MaBenhAn, NoiDung, NgayKe }) {
    return query(`INSERT INTO DonThuoc (MaBenhAn, NoiDung, NgayKe) VALUES (?, ?, ?)`, [
      MaBenhAn,
      NoiDung || null,
      NgayKe || new Date()
    ]);
  },

  getPrescriptionsByRecord(MaBenhAn) {
    return query(`SELECT MaDonThuoc, MaBenhAn, NoiDung, NgayKe FROM DonThuoc WHERE MaBenhAn = ? ORDER BY NgayKe DESC`, [MaBenhAn]);
  },

  updatePrescription(MaDonThuoc, { NoiDung, NgayKe }) {
    return query(`UPDATE DonThuoc SET NoiDung = ?, NgayKe = ? WHERE MaDonThuoc = ?`, [
      NoiDung || null,
      NgayKe || new Date(),
      MaDonThuoc
    ]);
  },

  deletePrescription(MaDonThuoc) {
    return query(`DELETE FROM DonThuoc WHERE MaDonThuoc = ?`, [MaDonThuoc]);
  },

  createTestResult({ MaBenhAn, TenXetNghiem, KetQua, NgayXetNghiem }) {
    return query(`INSERT INTO KetQuaXetNghiem (MaBenhAn, TenXetNghiem, KetQua, NgayXetNghiem) VALUES (?, ?, ?, ?)`, [
      MaBenhAn,
      TenXetNghiem || null,
      KetQua || null,
      NgayXetNghiem || new Date()
    ]);
  },

  getTestResultsByRecord(MaBenhAn) {
    return query(
      `SELECT MaKetQua, MaBenhAn, TenXetNghiem, KetQua, NgayXetNghiem FROM KetQuaXetNghiem WHERE MaBenhAn = ? ORDER BY NgayXetNghiem DESC`,
      [MaBenhAn]
    );
  },

  updateTestResult(MaKetQua, { TenXetNghiem, KetQua, NgayXetNghiem }) {
    return query(`UPDATE KetQuaXetNghiem SET TenXetNghiem = ?, KetQua = ?, NgayXetNghiem = ? WHERE MaKetQua = ?`, [
      TenXetNghiem || null,
      KetQua || null,
      NgayXetNghiem || new Date(),
      MaKetQua
    ]);
  },

  deleteTestResult(MaKetQua) {
    return query(`DELETE FROM KetQuaXetNghiem WHERE MaKetQua = ?`, [MaKetQua]);
  }
};

module.exports = medicalRecordModel;