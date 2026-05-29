const dichVuModel = require("../models/dichvu.model");

const getAllDichVu = (callback) => {

    dichVuModel.getAllDichVu(callback);

};

const getDichVuById = (id, callback) => {

    dichVuModel.getDichVuById(id, callback);

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
    getDichVuById,
    createDichVu,
    updateDichVu,
    deleteDichVu
};