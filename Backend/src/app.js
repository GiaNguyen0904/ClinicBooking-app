const express = require("express");
const cors = require("cors");

const scheduleRoutes = require("./routes/schedule.routes");
const appointmentRoutes = require('./routes/appointment.routes');
const medicalRecordRoutes = require("./routes/medical-record.routes");
const dichVuRoute = require("./routes/dichvu.route");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/schedules", scheduleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/dichvu", dichVuRoute);





app.get("/", (req, res) => {
  res.send("API running...");
});

module.exports = app;