const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const mailgun = require('mailgun-js');
const mgun = mailgun({ apiKey: process.env.MAILGUN_URI, domain: process.env.MAILGUN_DOMAIN });

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
        isActive: false,
        isApprovedAuthority: false,
    };

    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
        const password = await bcrypt.hash(req.body.password, 10);

        userData.password = password;

        const createdUser = await User.create(userData);

        const requestPayload = {
            id: createdUser._id,
        };

        const token = jwt.sign(requestPayload, process.env.SECRET_KEY, {
            expiresIn: 259200,
        });

        const activateEmailData = {
            from: 'mailgun@sandboxf07cb7ab3c65458885387544b6e7ffcb.mailgun.org',
            to: userData.email,
            subject: 'Activate your account',
            html: `
            <h1>Please activate your account on complaint manager Ukraine </h1>
            <a href="${process.env.CLIENT_URL}/activate/${token}">Click here to activate</a>
            `,
        };

        mgun.messages().send(activateEmailData, async (error, body) => {
            if (error) {
                res.status(400).send({ message: 'Error sending email' });
                return;
            }

            return res.json({
                message: 'Email has been sent, please activate your account!',
                createdUser,
            });
        });

        // res.json({ message: 'User successfully created!', createdUser });
    } else {
        res.status(400).send({ message: 'There is already a user with the same email!' });
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
                expiresIn: 86400,
            });
            res.json({ message: 'User logged in', token });
        } else {
            res.json({ message: "Passwords don't match!" });
        }
    } else {
        res.json({ message: "User doesn't exist" });
    }
});

users.patch('/activate', async (req, res) => {
    const userData = {
        id: req.body.id,
        isActive: req.body.isActive,
    };

    const user = await User.findOneAndUpdate(
        { _id: userData.id },
        { $set: { isActive: userData.isActive } },
    );

    res.json({ message: 'User activated!', activatedUser: user });
});

users.post('/isActivated', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(403).send('Forbidden');
        return;
    }

    if (!user.isActive) {
        res.status(403).send('Forbidden');
        return;
    }

    res.json({ message: 'User is activated' });
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

    const userToUpdate = await User.findOne({ _id: decoded.id });

    if (userToUpdate.email !== userData.email) {
        const userWithEditedEmail = await User.findOne({ email: userData.email });

        if (userWithEditedEmail) res.json({ message: 'User with such email already exists!' });
    }

    const user = await User.findOneAndUpdate({ _id: decoded.id }, userData);

    if (user) {
        res.json({ message: 'User successfully edited!', updatedUser: user });
    } else {
        res.json({ message: 'User could not be updated!' });
    }
});

users.get('/user/token', async (req, res) => {
    try {
        if (req.headers['authorization'] === 'undefined') {
            res.status(403).send('Forbidden');
            return;
        }
        const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
        const user = await User.findOne({ _id: decoded.id });

        if (user) {
            res.json({ message: 'Token is valid' });
        } else {
            res.status(403).send('Forbidden');
        }
    } catch (e) {
        res.status(403).send('Forbidden');
    }
});

users.get('/:id', async (req, res) => {
    const id = req.params.id;

    const user = await User.findOne({ _id: id });

    if (user) {
        res.json({ message: 'User is found!', user });
    } else {
        res.json({ message: 'User is not found' });
    }
});

module.exports = users;
