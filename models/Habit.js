const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  completedDates: [
    {
      type: String
    }
  ]
});

module.exports = mongoose.model("Habit", habitSchema);