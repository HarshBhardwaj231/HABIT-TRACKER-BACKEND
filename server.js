const mongoose = require("mongoose");
require('dotenv').config();
console.log(process.env.MONGO_URI);

const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

// ADD THIS
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Error:", err);
  });

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
const authMiddleware = require("./middleware/authMiddleware");

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized 🔥" });
});
const habitRoutes = require("./routes/habitRoutes");

app.use("/api/habits", habitRoutes);