const axios = require('axios');

async function testLogin() {
  try {
    const baseUrl = 'http://localhost:3000/login';

    // Modify the username and password parameters to test different logins
    const data = {
      username: '1testt@example.com',
      password: 'password123',
    };

    const response = await axios.post(baseUrl, data);

    console.log('Login response:', response.data);
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

testLogin();
