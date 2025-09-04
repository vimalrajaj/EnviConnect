const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// Username check
router.get("/check-username/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (user) return res.status(400).json({ message: "Username already taken" });
  res.json({ message: "Username available" });
});

// Login user (dummy, always success, redirect to home.html)
router.post("/login", async (req, res) => {
  // You can add real authentication later
  res.json({ success: true, redirect: "home.html" });
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, state, city, designation } = req.body;

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      state,
      city,
      designation
    });
    await newUser.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
