const db = require("../config/db");

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

    db.query(sql, callback);

};

const searchDichVuByName = (name, callback) => {

    const sql = `
        SELECT *
        FROM DichVu
        WHERE TenDichVu LIKE ?
    `;

    db.query(sql, [`%${name}%`], callback);

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

    db.query(
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

    db.query(
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

    db.query(sql, [id], callback);

};


module.exports = {
    getAllDichVu,
    searchDichVuByName,
    createDichVu,
    updateDichVu,
    deleteDichVu
};