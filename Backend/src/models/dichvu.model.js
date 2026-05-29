const con = require("../config/db");

const getAllDichVu = (callback) => {

    const sql = `
        SELECT 
            dv.MaDichVu,
            dv.TenDichVu,
            dv.Gia,
            dv.MoTa,

            bs.MaBacSi,
            bs.HoTen,
            bs.ChuyenKhoa

        FROM DichVu dv

        LEFT JOIN BacSi bs
        ON dv.MaBacSi = bs.MaBacSi
    `;

    con.query(sql, callback);

};

const getDichVuById = (id, callback) => {

    const sql = `
        SELECT 
            dv.MaDichVu,
            dv.TenDichVu,
            dv.Gia,
            dv.MoTa,

            bs.MaBacSi,
            bs.HoTen,
            bs.Email,
            bs.SoDienThoai,
            bs.ChuyenKhoa

        FROM DichVu dv

        LEFT JOIN BacSi bs
        ON dv.MaBacSi = bs.MaBacSi

        WHERE dv.MaDichVu = ?
    `;

    con.query(sql, [id], callback);

};

const createDichVu = (data, callback) => {

    const {
        TenDichVu,
        Gia,
        MoTa,
        MaBacSi
    } = data;

    const sql = `
        INSERT INTO DichVu(
            TenDichVu,
            Gia,
            MoTa,
            MaBacSi
        )
        VALUES (?, ?, ?, ?)
    `;

    con.query(
        sql,
        [
            TenDichVu,
            Gia,
            MoTa,
            MaBacSi
        ],
        callback
    );

};

const updateDichVu = (id, data, callback) => {

    const {
        TenDichVu,
        Gia,
        MoTa,
        MaBacSi
    } = data;

    const sql = `
        UPDATE DichVu
        SET
            TenDichVu = ?,
            Gia = ?,
            MoTa = ?,
            MaBacSi = ?
        WHERE MaDichVu = ?
    `;

    con.query(
        sql,
        [
            TenDichVu,
            Gia,
            MoTa,
            MaBacSi,
            id
        ],
        callback
    );

};

const deleteDichVu = (id, callback) => {

    const sql = `
        DELETE FROM DichVu
        WHERE MaDichVu = ?
    `;

    con.query(sql, [id], callback);

};


module.exports = {
    getAllDichVu,
    getDichVuById,
    createDichVu,
    updateDichVu,
    deleteDichVu
};