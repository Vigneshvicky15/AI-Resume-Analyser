const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/ai_resume_analyzer';

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    // Clean up
    await User.deleteOne({ email: 'api_test@example.com' });
    console.log('Cleaned up old user');

    // Register via API
    console.log('Registering user via API...');
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'API Test User',
      email: 'api_test@example.com',
      password: 'password123'
    });
    console.log('Register response:', regRes.data);

    // Fetch user from DB
    const user = await User.findOne({ email: 'api_test@example.com' });
    console.log('Registered user hash in DB:', user.password);

    // Login via API
    console.log('Logging in via API...');
    try {
      const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'api_test@example.com',
        password: 'password123'
      });
      console.log('Login response:', loginRes.data);
    } catch (loginErr) {
      console.error('Login request failed:', loginErr.response?.data || loginErr.message);
    }

    // Clean up
    await User.deleteOne({ email: 'api_test@example.com' });
    console.log('Cleaned up api test user');

  } catch (err) {
    console.error('Test failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

test();
