const bcrypt = require('bcryptjs');

const hash = '$2a$10$yvFZZg4uExRS/Cj6dD3YiONpSd/J3smt21acveuXtjCcn2k1T5.JC';

// Test some common passwords
const candidatePasswords = ['123456', 'vignesh', 'vignesh123', 'vignesh515', 'password', '12345678', 'vigneshvel515'];

async function run() {
  for (const pw of candidatePasswords) {
    const match = await bcrypt.compare(pw, hash);
    console.log(`Password "${pw}": ${match ? 'MATCHES! 🎉' : 'Does not match.'}`);
  }
}

run();
