const dichVuService = require("../services/dichvu.service");
const db = require("../config/db");

const getAllDichVu = (req, res) => {

    dichVuService.getAllDichVu(
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json(result);

        }
    );

};

const searchDichVuByName = (req, res) => {

    const { name } = req.query;

    dichVuService.searchDichVuByName(
        name,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Không tìm thấy dịch vụ"
                });

            }

            res.json(result);

        }
    );

};

const createDichVu = (req, res) => {

    dichVuService.createDichVu(
        req.body,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json({
                message: "Thêm dịch vụ thành công"
            });

        }
    );

};

const updateDichVu = (req, res) => {

    const { id } = req.params;

    dichVuService.updateDichVu(
        id,
        req.body,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json({
                message: "Cập nhật dịch vụ thành công"
            });

        }
    );

};


const deleteDichVu = (req, res) => {

    const { id } = req.params;

    dichVuService.deleteDichVu(
        id,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            res.json({
                message: "Xóa dịch vụ thành công"
            });

        }
    );

};


module.exports = {
    getAllDichVu,
    searchDichVuByName,
    createDichVu,
    updateDichVu,
    deleteDichVu
};