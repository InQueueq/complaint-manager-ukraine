const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

process.env.SECRET_KEY = 'secret';

const admin = express.Router();

admin.get('/authorities/unapproved', async (req, res) => {
    const authorities = await User.find({ isApprovedAuthority: false, userType: 2 });

    res.json({ authorities });
});

admin.get('/authorities', async (req, res) => {
    const authorities = await User.find({ userType: 2 });

    res.json({ authorities });
});

admin.post('/authorities/approve', async (req, res) => {
    const authorityId = {
        _id: req.body._id,
    };

    await User.updateOne({ _id: authorityId._id }, { $set: { isApprovedAuthority: true } });

    res.json({ message: 'Success!' });
});

admin.delete('/authorities/:id', async (req, res) => {
    const id = req.params.id;

    const user = await User.findOne({ _id: id });

    await User.deleteOne({ _id: id });

    res.json({ id: user.id });
});

module.exports = admin;
