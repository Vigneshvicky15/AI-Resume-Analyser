const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/ai_resume_analyzer';

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const users = await User.find({});
    console.log('Total users:', users.length);
    users.forEach((u, idx) => {
      console.log(`User ${idx + 1}:`);
      console.log(`  ID: ${u._id}`);
      console.log(`  Name: ${u.name}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Password Hash: ${u.password}`);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
