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

module.exports = admin;
