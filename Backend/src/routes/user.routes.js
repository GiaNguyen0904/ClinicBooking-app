const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// Public routes
router.post("/register", userController.initiateRegister);
router.post("/verify-otp", userController.verifyRegisterOTP);
router.post("/login", userController.login);
router.get("/doctors", userController.getAllDoctors);
router.get("/doctors/:id", userController.getDoctorById);

// Protected routes
router.get("/me", authenticate, userController.getProfile);
router.put("/me", authenticate, userController.updateProfile);

module.exports = router;
