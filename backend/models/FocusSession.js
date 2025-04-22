const mongoose = require("mongoose");

const FocusSessionSchema = new mongoose.Schema({
  startTime: Date,
  endTime: Date,
  durationMinutes: Number
});

module.exports = mongoose.model("FocusSession", FocusSessionSchema);
