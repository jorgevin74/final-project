const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    score: String,
    review: String,
    numberOfLikes: Number,
    albumCover: String,
    artist: String,
    title: String,
    value: Number,
}, { timestamps: true });


module.exports = mongoose.model('Reviews', reviewSchema);