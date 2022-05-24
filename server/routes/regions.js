const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');

const Region = require('../models/region.js');

const regions = express.Router();

regions.use(cors());

regions.get('/', async (req, res) => {
    const { regionName } = req.query;

    const region = await Region.findOne({ name: regionName });

    if (region) {
        res.json(region);
    } else {
        res.send('Region with such name does not exist');
    }
});

regions.get('/all', async (req, res) => {
    const regions = await Region.find();

    if (regions.length) {
        res.json({ regions });
    } else {
        res.send('No regions were found');
    }
});

module.exports = regions;
