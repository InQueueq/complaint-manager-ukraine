const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');

const Marker = require('../models/marker.js');

process.env.SECRET_KEY = 'secret';

const complaints = express.Router();

complaints.use(cors());

complaints.post('/', async (req, res) => {
    const complaintData = {
        name: req.body.name,
        description: req.body.description,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        creator: req.body.creator,
        inProcess: req.body.inProcess,
        region: req.body.region,
        rating: req.body.rating,
        createdAt: req.body.createdAt,
    };

    const createdMarker = await Marker.create(complaintData);

    if (createdMarker) {
        res.json({ message: 'Complaint has been created!', createdMarker });
    } else {
        res.json({ message: 'Complaint has not been created' });
    }
});

complaints.post('/resolve', async (req, res) => {
    const complaintData = {
        _id: req.body._id,
        inProcess: req.body.inProcess,
    };

    await Marker.updateOne(
        { _id: complaintData._id },
        { $set: { inProcess: complaintData.inProcess } },
    );

    res.json({ message: 'Success!' });
});

complaints.get('/', async (req, res) => {
    const markers = await Marker.find();

    res.json({ markers });
});

complaints.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const markers = await Marker.find({ creator: id });

    res.json({ markers });
});

complaints.get('/:id', async (req, res) => {
    const id = req.params.id;

    const marker = await Marker.findOne({ _id: id });

    if (marker) {
        res.json({ message: 'Marker is found!', marker });
    } else {
        res.json({ message: 'Marker not found' });
    }
});

module.exports = complaints;
