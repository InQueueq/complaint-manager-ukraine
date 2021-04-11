const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    text: String,
    markerId: mongoose.Schema.Types.ObjectId,
});

const Comment = mongoose.model('comments', CommentSchema);

module.exports = Comment;
