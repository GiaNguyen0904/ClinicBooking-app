const express = require("express");

const router = express.Router();

const dichVuController = require("../controllers/dichvu.controller");

router.get(
    "/danhsach",
    dichVuController.getAllDichVu
);


// GET BY ID
router.get(
    "/danhsach/:id",
    dichVuController.getDichVuById
);


// CREATE
router.post(
    "/taodichvu",
    dichVuController.createDichVu
);


// UPDATE
router.put(
    "/capnhat/:id",
    dichVuController.updateDichVu
);


// DELETE
router.delete(
    "/xoa/:id",
    dichVuController.deleteDichVu
);


module.exports = router;