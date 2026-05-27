const express = require("express");

const router = express.Router();

const scheduleController = require(
  "../controllers/schedule.controller"
);

router.post(
  "/",
  scheduleController.createSchedule
);

router.put(
  "/:id",
  scheduleController.updateSchedule
);

router.delete(
  "/:id",
  scheduleController.deleteSchedule
);

router.get(
  "/",
  scheduleController.getSchedules
);

router.get(
  "/available",
  scheduleController.getAvailableSchedules
);

router.get(
  "/:id/available",
  scheduleController.checkScheduleAvailable
);

module.exports = router;