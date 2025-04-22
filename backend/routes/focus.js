const express = require("express");
const router = express.Router();
const FocusSession = require("../models/FocusSession");

router.post("/start", async (req, res) => {
  const session = new FocusSession({ startTime: new Date() });
  await session.save();
  res.status(201).json(session);
});

router.post("/stop/:id", async (req, res) => {
  const session = await FocusSession.findById(req.params.id);
  if (session) {
    session.endTime = new Date();
    session.durationMinutes = Math.floor((session.endTime - session.startTime) / 60000);
    await session.save();
    res.status(200).json(session);
  } else {
    res.status(404).json({ error: "Session not found" });
  }
});

module.exports = router;
