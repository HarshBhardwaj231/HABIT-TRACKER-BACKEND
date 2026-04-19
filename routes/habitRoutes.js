const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE HABIT
router.post("/", authMiddleware, async (req, res) => {
  try {
    const habit = new Habit({
      title: req.body.title,
      userId: req.user.id
    });

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET HABITS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE HABIT
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// UPDATE habit
router.put("/:id", async (req, res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// MARK HABIT COMPLETE
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date().toISOString().split("T")[0];

    // avoid duplicate entry
    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
    }

    await habit.save();

    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET STREAK
router.get("/:id/streak", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const dates = habit.completedDates.sort(); // ascending

    let streak = 0;
    let today = new Date();

    for (let i = dates.length - 1; i >= 0; i--) {
      const date = new Date(dates[i]);

      const diff = Math.floor(
        (today - date) / (1000 * 60 * 60 * 24)
      );

      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});