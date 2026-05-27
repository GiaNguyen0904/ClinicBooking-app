const express = require("express");
const cors = require("cors");

const appointmentRoutes = require('./routes/appointment.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

module.exports = app;