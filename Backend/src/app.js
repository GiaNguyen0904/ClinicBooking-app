const express = require("express");
const cors = require("cors");
const scheduleRoutes = require(
  "./routes/schedule.routes"
);

const appointmentRoutes = require('./routes/appointment.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});



app.use(
  "/api/schedules",
  scheduleRoutes
);
module.exports = app;