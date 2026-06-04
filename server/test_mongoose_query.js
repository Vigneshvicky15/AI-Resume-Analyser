const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/ai_resume_analyzer';

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // 1. Create a user
    const testEmail = 'query_test@example.com';
    await User.deleteOne({ email: testEmail });
    
    await User.create({
      name: 'Query Test User',
      email: '  Query_Test@example.com  ', // Mixed case and spaces
      password: 'password123'
    });

    // 2. Query with exact lowercase and trimmed
    const q1 = await User.findOne({ email: 'query_test@example.com' });
    console.log('q1 (exact match) found:', !!q1);

    // 3. Query with mixed case
    const q2 = await User.findOne({ email: 'Query_Test@example.com' });
    console.log('q2 (mixed case) found:', !!q2);

    // 4. Query with trailing/leading spaces
    const q3 = await User.findOne({ email: '  query_test@example.com  ' });
    console.log('q3 (spaces in query) found:', !!q3);

    // 5. Query with spaces in mixed case
    const q4 = await User.findOne({ email: '  Query_Test@example.com  ' });
    console.log('q4 (spaces & mixed case) found:', !!q4);

    await User.deleteOne({ email: testEmail });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
