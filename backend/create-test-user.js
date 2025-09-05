// Quick user creation script
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if test user already exists
    const existingUser = await User.findOne({ username: 'eco_warrior' });
    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('Username: eco_warrior');
      console.log('Password: test123');
      console.log('User ID:', existingUser._id.toString());
      process.exit(0);
    }
    
    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 10);
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
    console.log('✅ Test user created successfully!');
    console.log('Username: eco_warrior');
    console.log('Password: test123'); 
    console.log('User ID:', testUser._id.toString());
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestUser();
