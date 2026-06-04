const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/ai_resume_analyzer';

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // 1. Create a user
    const testEmail = 'unselected_test@example.com';
    await User.deleteOne({ email: testEmail });
    await User.create({
      name: 'Unselected Test User',
      email: testEmail,
      password: 'password123'
    });

    // 2. Fetch user without password
    const user = await User.findOne({ email: testEmail }).select('-password');
    console.log('Fetched user (password should be undefined):', user.password);

    // 3. Modify name and save
    user.name = 'Unselected Test User Updated';
    console.log('Saving user...');
    await user.save();

    // 4. Fetch user fresh with password and check if it still matches 'password123'
    const userFresh = await User.findOne({ email: testEmail });
    console.log('Fresh password hash in DB:', userFresh.password);
    const match = await userFresh.matchPassword('password123');
    console.log('Does password still match?', match);

    // Clean up
    await User.deleteOne({ email: testEmail });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
