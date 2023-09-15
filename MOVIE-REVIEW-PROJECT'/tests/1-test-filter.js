// 1-test-filter.js
const axios = require('axios');

async function testMovieFilter() {
    try {
        const baseUrl = 'http://localhost:3000/movies/filter';

        // Modify the query parameters to test different filter combinations
        const queryParams = '?startYear=2020&runtimeMinutes=120';
        const response = await axios.get(`${baseUrl}${queryParams}`);

        console.log('Filtered movies:', response.data);
    } catch (error) {
        console.error('Error testing movie filter:', error);
    }
}

testMovieFilter();
