const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

// Public: xem dịch vụ
router.get("/", serviceController.getAll);
router.get("/:id", serviceController.getById);

// Admin quản lý dịch vụ
router.use(authenticate);
router.post("/", authorize("ADMIN"), serviceController.create);
router.put("/:id", authorize("ADMIN"), serviceController.update);
router.delete("/:id", authorize("ADMIN"), serviceController.delete);

module.exports = router;
