const express = require("express");
const User = require("../models/User");
const Project = require("../models/Project");
const router = express.Router();

// Get user profile data
router.get("/api/users/:id/profile", async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get projects created by user
    const createdProjects = await Project.find({ owner: user.username });
    
    // Get projects where user might be a volunteer (simplified for now)
    const allProjects = await Project.find();
    
    // Calculate participation stats
    const currentYear = new Date().getFullYear();
    const monthlyStats = [];
    
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(currentYear, month, 1);
      const monthEnd = new Date(currentYear, month + 1, 0);
      
      const projectsInMonth = createdProjects.filter(project => {
        const projectDate = new Date(project.createdAt);
        return projectDate >= monthStart && projectDate <= monthEnd;
      });
      
      monthlyStats.push({
        month: month + 1,
        projects: projectsInMonth.length
      });
    }

    // Calculate category stats
    const categoryStats = {};
    createdProjects.forEach(project => {
      categoryStats[project.theme] = (categoryStats[project.theme] || 0) + 1;
    });

    // Profile response
    const profileData = {
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        location: user.location || `${user.city}, ${user.state}`,
        age: user.age,
        designation: user.designation,
        joinedAt: user.joinedAt
      },
      stats: {
        projectsCreated: createdProjects.length,
        projectsJoined: user.projectsJoined || 0,
        contributions: user.contributions || 0,
        followers: Math.floor(Math.random() * 50) + 10 // Placeholder for now
      },
      createdProjects: createdProjects,
      monthlyStats: monthlyStats,
      categoryStats: categoryStats
    };

    res.json(profileData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user profile
router.put("/api/users/:id/profile", async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    
    // Remove sensitive fields
    delete updates.password;
    delete updates.email;
    
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
