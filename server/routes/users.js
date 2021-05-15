const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

process.env.SECRET_KEY = 'secret';

const users = express.Router();

users.use(cors());

users.post('/register', async (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        organisation: req.body.organisation,
        userType: req.body.userType,
    };

    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
        const password = await bcrypt.hash(req.body.password, 10);

        userData.password = password;

        const createdUser = await User.create(userData);

        res.json({ message: 'User successfully created!', createdUser });
    } else {
        res.json({ message: 'There is already a user with the same email!' });
    }
});

users.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const requestPayload = {
                id: user._id,
            };
            const token = jwt.sign(requestPayload, process.env.SECRET_KEY, {
                expiresIn: 1440,
            });
            res.json({ message: 'User logged in', token });
        } else {
            res.json({ message: "Passwords don't match!" });
        }
    } else {
        res.json({ message: "User doesn't exist" });
    }
});

users.get('/profile/info', async (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

    const user = await User.findOne({ _id: decoded.id });

    if (user) {
        res.json(user);
    } else {
        res.send('User does not exist');
    }
});

users.put('/profile/info', async (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

    const userData = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        organisation: req.body.organisation,
        userType: req.body.userType,
    };

    const userWithEditedEmail = await User.findOne({ email: userData.email });

    if (!userWithEditedEmail) {
        const user = await User.findOneAndUpdate({ _id: decoded.id }, userData);

        if (user) {
            res.json({ message: 'User successfully edited!', updatedUser });
        } else {
            res.json({ message: 'User could not be updated!' });
        }
    } else {
        res.json({ message: 'User with such email already exists!' });
    }
});

module.exports = users;
