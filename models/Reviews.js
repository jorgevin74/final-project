const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    score: String,
    review: String,
    numberOfLikes: Number,
});

module.exports = mongoose.model('Reviews', reviewSchema);