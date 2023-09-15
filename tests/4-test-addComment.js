const axios = require('axios');

async function testAddComment() {
    try {
        const baseUrl = 'http://localhost:3000/movies/:movieId/addcomment';

        // Modify the movieId and commentText parameters to test different comments
        const movieId = '6413aeb8b2fca8fb49517e09';
        const commentText = 'This movie is great!';

        const data = {
            comment: commentText,
        };

        const url = baseUrl.replace(':movieId', movieId);
        const response = await axios.post(url, data);

        console.log('Add comment response:', response.data);
    } catch (error) {
        console.error('Error testing add comment:', error);
    }
}

testAddComment();

