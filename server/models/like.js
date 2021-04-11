const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    isPositive: Boolean,
    markerId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
});

const Like = mongoose.model('likes', LikeSchema);

module.exports = Like;
