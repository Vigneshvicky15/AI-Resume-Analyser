const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/ai_resume_analyzer';

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const user = await User.findOne({ email: 'shaikm407@gmail.com' });
    if (user) {
      console.log('Found user shaikm407@gmail.com');
      console.log('User hash in DB:', user.password);
      
      // Let's test a few common passwords or email prefix
      const passwords = ['vicky', 'shaikm407', 'shaik123', 'shaikm407@gmail.com', 'password123', 'vignesh123', '123456', 'vicky123'];
      for (const p of passwords) {
        const match = await user.matchPassword(p);
        console.log(`Comparison of "${p}":`, match);
      }
    } else {
      console.log('User shaikm407@gmail.com not found');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
