const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const medicalRecordRoutes = require("./routes/medical-record.routes");
const serviceRoutes = require("./routes/service.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "PhongKham API đang chạy",
    version: "2.0.0",
    endpoints: {
      users: "/api/users",
      schedules: "/api/schedules",
      appointments: "/api/appointments",
      medicalRecords: "/api/medical-records",
      services: "/api/services",
      dashboard: "/api/dashboard",
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Đã xảy ra lỗi server." });
});

module.exports = app;
