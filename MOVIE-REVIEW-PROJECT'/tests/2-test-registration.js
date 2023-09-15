const axios = require('axios');

async function testRegistration() {
    try {
        const baseUrl = 'http://localhost:3000/register';

        // Modify the email and password parameters to test different user creations
        const data = {
            username: '1testt@example.com',
            password: 'password123'
        };

        const response = await axios.post(baseUrl, data);

        console.log('Registration response:', response.data);
    } catch (error) {
        console.error('Error testing registration:', error);
    }
}

testRegistration();
