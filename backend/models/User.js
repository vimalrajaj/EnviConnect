const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  state: String,
  city: String,
  designation: String,
  bio: { type: String, default: "Environmental enthusiast making a difference one project at a time." },
  avatar: { type: String, default: "https://via.placeholder.com/150/2e7d32/ffffff?text=User" },
  location: String,
  age: Number,
  joinedAt: { type: Date, default: Date.now },
  projectsCreated: { type: Number, default: 0 },
  projectsJoined: { type: Number, default: 0 },
  contributions: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", userSchema);
