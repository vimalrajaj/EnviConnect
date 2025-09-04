const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  theme: { type: String, required: true },
  name: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  brief: { type: String, maxlength: 600, required: true },
  details: { type: String, required: true },
  images: [String],
  info: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", projectSchema);
