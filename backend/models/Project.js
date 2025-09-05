const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  theme: { 
    type: String, 
    required: true,
    enum: [
      'Renewable Energy',
      'Waste Management', 
      'Tree Plantation',
      'Awareness Campaign',
      'Sustainable Farming',
      'Water Conservation',
      'Clean Transportation',
      'Others'
    ]
  },
  name: { type: String, required: true, trim: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  brief: { 
    type: String, 
    required: true,
    maxlength: 600
  },
  details: { type: String, required: true },
  images: [String],
  info: { type: String },
  owner: { type: String, required: true },
  volunteers: { type: Number, default: 0 },
  volunteerGoal: { type: Number, default: 20 },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Project", projectSchema);
