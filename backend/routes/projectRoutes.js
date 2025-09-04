const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const multer = require("multer");

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/"); // create an "uploads" folder in root
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST route to add a project
router.post("/add", upload.array("images"), async (req, res) => {
  try {
    const { theme, name, duration, location, brief, details, info } = req.body;

    // Validate brief description word limit
    const wordCount = brief.trim().split(/\s+/).length;
    if (wordCount > 100) {
      return res.status(400).json({ error: "Brief description cannot exceed 100 words" });
    }

    const imagePaths = req.files.map(file => file.path);

    const newProject = new Project({
      theme,
      name,
      duration,
      location,
      brief,
      details,
      images: imagePaths,
      info
    });

    await newProject.save();
    res.status(201).json({ message: "Project created successfully", project: newProject });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET single project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

module.exports = router;
