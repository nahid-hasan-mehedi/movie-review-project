const axios = require('axios');

async function testAddCommentRating() {
    try {
        const baseUrl = 'http://localhost:3000/comments/:commentId/addrating';

        const commentId = '6416235bfd364339991dbb14';
        const ratingValue = 4;

        const data = {
            ratingValue: ratingValue,
        };

        const url = baseUrl.replace(':commentId', commentId);
        const response = await axios.post(url, data);

        console.log('Add comment rating response:', response.data);
    } catch (error) {
        console.error('Error testing add comment rating:', error);
    }
}

testAddCommentRating();
