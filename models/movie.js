const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    originalTitle: String,
    startYear: Number,
    runtimeMinutes: Number,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rating',
        },
    ],
});

movieSchema.statics.findByFilters = async function (filters) {
    try {
        if (!filters.startYear && !filters.runtimeMinutes) {
            throw new Error('At least one filter (startYear or runtimeMinutes) must be provided.');
        }

        let query = {};

        if (filters.startYear) {
            query.startYear = filters.startYear;
        }

        if (filters.runtimeMinutes) {
            query.runtimeMinutes = filters.runtimeMinutes;
        }

        const movies = await this.find(query)
            .populate({
                path: 'comments',
                select: 'text -_id',
            })
            .populate({
                path: 'ratings',
                select: 'ratingValue -_id',
            })
            .limit(10);

        return movies;
    } catch (error) {
        console.error('Error filtering movies:', error);
        return [];
    }
};


const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
