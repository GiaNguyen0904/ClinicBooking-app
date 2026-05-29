const db = require("../config/db");

const serviceModel = {
  getAll({ MaBacSi } = {}) {
    let sql = `
      SELECT dv.MaDichVu, dv.TenDichVu, dv.Gia, dv.MoTa,
             bs.MaBacSi, bs.HoTen AS TenBacSi, bs.ChuyenKhoa
      FROM DichVu dv
      LEFT JOIN BacSi bs ON dv.MaBacSi = bs.MaBacSi
      WHERE 1=1
    `;
    const params = [];
    if (MaBacSi) {
      sql += ` AND dv.MaBacSi = ?`;
      params.push(MaBacSi);
    }
    sql += ` ORDER BY dv.TenDichVu`;
    return db.query(sql, params);
  },

  getById(MaDichVu) {
    return db.query(
      `SELECT dv.*, bs.HoTen AS TenBacSi, bs.ChuyenKhoa, bs.Email AS EmailBacSi, bs.SoDienThoai AS SDTBacSi
       FROM DichVu dv
       LEFT JOIN BacSi bs ON dv.MaBacSi = bs.MaBacSi
       WHERE dv.MaDichVu = ?`,
      [MaDichVu]
    );
  },

  create({ TenDichVu, Gia, MoTa, MaBacSi }) {
    return db.query(
      `INSERT INTO DichVu (TenDichVu, Gia, MoTa, MaBacSi) VALUES (?, ?, ?, ?)`,
      [TenDichVu, Gia, MoTa || null, MaBacSi || null]
    );
  },

  update(MaDichVu, { TenDichVu, Gia, MoTa, MaBacSi }) {
    return db.query(
      `UPDATE DichVu SET TenDichVu=?, Gia=?, MoTa=?, MaBacSi=? WHERE MaDichVu=?`,
      [TenDichVu, Gia, MoTa || null, MaBacSi || null, MaDichVu]
    );
  },

  delete(MaDichVu) {
    return db.query(`DELETE FROM DichVu WHERE MaDichVu = ?`, [MaDichVu]);
  },
};

module.exports = serviceModel;
