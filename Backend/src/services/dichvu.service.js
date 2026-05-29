const db = require("../config/db");
const dichVuModel = require("../models/dichvu.model");


const getAllDichVu = (callback) => {

    dichVuModel.getAllDichVu(callback);

};

const searchDichVuByName = (name, callback) => {

    dichVuModel.searchDichVuByName(
        name,
        callback
    );

};
const createDichVu = (data, callback) => {

    dichVuModel.createDichVu(data, callback);

};

const updateDichVu = (id, data, callback) => {

    dichVuModel.updateDichVu(
        id,
        data,
        callback
    );

};

const deleteDichVu = (id, callback) => {

    dichVuModel.deleteDichVu(id, callback);

};


module.exports = {
    getAllDichVu,
    searchDichVuByName,
    createDichVu,
    updateDichVu,
    deleteDichVu
};