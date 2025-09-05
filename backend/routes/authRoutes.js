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
  try {
    const { login, password } = req.body;
    
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }]
    });
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    res.json({ success: true, redirect: "home.html", user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// OTP routes (placeholder for future implementation)
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  // Placeholder - implement actual OTP sending later
  res.json({ message: "OTP feature coming soon!" });
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  // Placeholder - implement actual OTP verification later
  res.json({ message: "OTP verification feature coming soon!" });
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const { 
      name, 
      username, 
      email, 
      password, 
      age, 
      sustainabilityFocus,
      // Legacy support for existing fields
      firstName, 
      lastName, 
      state, 
      city, 
      designation 
    } = req.body;

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      firstName: firstName || name?.split(' ')[0] || '',
      lastName: lastName || name?.split(' ')[1] || '',
      email,
      password: hashedPassword,
      state: state || '',
      city: city || '',
      designation: designation || sustainabilityFocus || ''
    });
    await newUser.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
