const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.use(authenticate, authorize("ADMIN"));

router.get("/", dashboardController.getDashboard);
router.get("/stats/monthly", dashboardController.getMonthlyStats);
router.get("/stats/services", dashboardController.getServiceStats);

module.exports = router;
