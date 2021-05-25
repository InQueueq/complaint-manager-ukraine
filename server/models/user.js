const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    organisation: String,
    userType: Number,
    isActive: Boolean,
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
