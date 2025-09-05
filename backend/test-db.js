// Quick database test script
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');

async function testDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check existing users
    const existingUsers = await User.find();
    console.log(`📊 Found ${existingUsers.length} existing users`);
    
    // Create a test user if none exists
    if (existingUsers.length === 0) {
      console.log('🔧 Creating test user...');
      
      const hashedPassword = await bcrypt.hash('testpass123', 10);
      const testUser = new User({
        username: 'eco_warrior',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@enviconnect.com',
        password: hashedPassword,
        bio: 'Passionate environmental activist working towards a sustainable future. Love working on renewable energy and tree plantation projects.',
        location: 'San Francisco, CA',
        designation: 'Environmental Engineer',
        age: 28,
        projectsCreated: 3,
        projectsJoined: 8,
        contributions: 25
      });
      
      await testUser.save();
      console.log('✅ Test user created successfully');
      console.log('   Username: eco_warrior');
      console.log('   Password: testpass123');
      console.log('   User ID:', testUser._id.toString());
    } else {
      console.log('📋 Existing users:');
      existingUsers.forEach(user => {
        console.log(`   - ${user.username} (${user.email}) - ID: ${user._id}`);
      });
    }
    
    // Check projects
    const projects = await Project.find();
    console.log(`📊 Found ${projects.length} projects`);
    
    if (projects.length === 0) {
      console.log('🔧 Creating sample projects...');
      
      const sampleProjects = [
        {
          theme: 'Tree Plantation',
          name: 'Green City Initiative',
          duration: '6 months',
          location: 'Central Park, NYC',
          brief: 'Large-scale tree plantation project to increase urban green cover and improve air quality in metropolitan areas.',
          details: 'This comprehensive project aims to plant 10,000 trees across various neighborhoods to create a greener, healthier city environment.',
          owner: 'eco_warrior',
          volunteers: 45,
          volunteerGoal: 100,
          status: 'active'
        },
        {
          theme: 'Renewable Energy',
          name: 'Solar Panel Community Project',
          duration: '3 months',
          location: 'San Francisco, CA',
          brief: 'Installing solar panels in community centers to promote renewable energy adoption and reduce carbon footprint.',
          details: 'Community-driven initiative to install solar energy systems in local centers, reducing electricity costs and environmental impact.',
          owner: 'eco_warrior',
          volunteers: 23,
          volunteerGoal: 50,
          status: 'active'
        },
        {
          theme: 'Waste Management',
          name: 'Ocean Cleanup Drive',
          duration: '2 months',
          location: 'California Coast',
          brief: 'Organized beach cleanup and ocean waste removal to protect marine ecosystems and promote environmental awareness.',
          details: 'Monthly beach cleanup events focused on removing plastic waste and debris from coastal areas to protect marine life.',
          owner: 'eco_warrior',
          volunteers: 78,
          volunteerGoal: 80,
          status: 'completed'
        }
      ];
      
      for (const projectData of sampleProjects) {
        const project = new Project(projectData);
        await project.save();
        console.log(`   ✅ Created project: ${project.name}`);
      }
    }
    
    console.log('\n🎉 Database test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
