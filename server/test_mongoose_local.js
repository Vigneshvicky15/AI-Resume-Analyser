const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/ai_resume_analyzer';

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Let's find vigneshvel515@gmail.com or create a user and check
    const user = await User.findOne({ email: 'vigneshvel515@gmail.com' });
    if (user) {
      console.log('Found user vigneshvel515@gmail.com');
      console.log('User hash in DB:', user.password);
      const match = await user.matchPassword('vignesh123');
      console.log('Comparison of vignesh123:', match);
      
      const match2 = await user.matchPassword('vigneshvel515');
      console.log('Comparison of vigneshvel515:', match2);
    } else {
      console.log('User vigneshvel515@gmail.com not found');
    }

    // Now let's try creating a user, saving them, and checking if they can login immediately, and if their hash changes
    const testEmail = 'scratch_test_user@example.com';
    await User.deleteOne({ email: testEmail });
    console.log('Creating scratch_test_user@example.com...');
    const newUser = await User.create({
      name: 'Scratch Test User',
      email: testEmail,
      password: 'password123'
    });
    console.log('Created. Hash in memory:', newUser.password);

    const fetchedNew1 = await User.findOne({ email: testEmail });
    console.log('Fetched 1. Hash in DB:', fetchedNew1.password);
    console.log('Fetched 1 matchPassword:', await fetchedNew1.matchPassword('password123'));

    // Let's do a save without modifying password
    fetchedNew1.name = 'Scratch Test User Updated';
    await fetchedNew1.save();
    
    const fetchedNew2 = await User.findOne({ email: testEmail });
    console.log('Fetched 2 (after save). Hash in DB:', fetchedNew2.password);
    console.log('Fetched 2 matchPassword:', await fetchedNew2.matchPassword('password123'));

    // Clean up
    await User.deleteOne({ email: testEmail });
    console.log('Cleaned up scratch test user');

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
