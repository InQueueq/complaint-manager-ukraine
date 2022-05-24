const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

process.env.SECRET_KEY = 'secret';

const admin = express.Router();

admin.get('/authorities/unapproved', async (req, res) => {
    const authorities = await User.find({ isApprovedAuthority: false });

    res.json({ authorities });
});

admin.post('/authorities/approve', async (req, res) => {
    const authorityId = {
        _id: req.body._id,
    };

    await User.updateOne({ _id: authorityId._id }, { $set: { isApprovedAuthority: true } });

    res.json({ message: 'Success!' });
});

module.exports = admin;
