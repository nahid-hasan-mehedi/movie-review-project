const axios = require('axios');

async function testLogout() {
  try {
    const baseUrl = 'http://localhost:3000/logout';

    // First, log in the user to get a session
    const loginData = {
      username: '1testt@example.com',
      password: 'password123',
    };

    const loginResponse = await axios.post('http://localhost:3000/login', loginData, {
      withCredentials: true,
    });

    console.log('Login response:', loginResponse.data);

    // Now, test the logout functionality
    const logoutResponse = await axios.post(baseUrl, {
      withCredentials: true,
    });

    console.log('Logout response:', logoutResponse.data);
  } catch (error) {
    console.error('Error testing logout:', error);
  }
}

testLogout();
