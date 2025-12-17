const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    score: String,
    review: String,
    numberOfLikes: { type: Number, default: 0 },
    albumCover: String,
    artist: String,
    title: String,
    createdAt: Date,
    value: Number,
});

module.exports = mongoose.model('Reviews', reviewSchema);