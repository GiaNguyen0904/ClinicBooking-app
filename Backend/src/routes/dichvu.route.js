const express = require("express");
const router = express.Router();

const dichVuController = require("../controllers/dichvu.controller");

router.get(
    "/danhsach",dichVuController.getAllDichVu
);


router.get("/search", dichVuController.searchDichVuByName);


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