const axios = require('axios');

async function testAddRating() {
    try {
        const baseUrl = 'http://localhost:3000/movies/:movieId/addrating';

        // Modify the movieId and ratingValue parameters to test different ratings
        const movieId = '6413aeb8b2fca8fb49517e09';
        const ratingValue = 4;

        const data = {
            ratingValue: ratingValue,
        };

        const url = baseUrl.replace(':movieId', movieId);
        const response = await axios.post(url, data);

        console.log('Add rating response:', response.data);
    } catch (error) {
        console.error('Error testing add rating:', error);
    }
}

testAddRating();
