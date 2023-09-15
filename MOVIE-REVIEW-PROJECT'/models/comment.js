const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
    },
    text: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Comment', commentSchema);
