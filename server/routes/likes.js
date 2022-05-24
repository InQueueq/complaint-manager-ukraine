const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');

const Like = require('../models/like.js');
const Marker = require('../models/marker.js');

const likes = express.Router();

likes.use(cors());

likes.post('/', async (req, res) => {
    const likeData = {
        isPositive: req.body.isPositive,
        markerId: req.body.markerId,
        userId: req.body.userId,
    };

    const like = await Like.findOne({ markerId: likeData.markerId, userId: likeData.userId });

    if (!like) {
        await Like.create(likeData);

        const likeCount = await Like.countDocuments({ markerId: likeData.markerId });

        const countOfPositive = (await Like.find({ markerId: likeData.markerId, isPositive: true }))
            .length;

        await Marker.updateOne(
            { _id: likeData.markerId },
            { $set: { rating: 2 * countOfPositive - likeCount } },
        );

        res.json({ message: 'Like was created!', newRating: 2 * countOfPositive - likeCount });
    } else {
        if (like.isPositive !== likeData.isPositive) {
            await Like.updateOne(
                { markerId: likeData.markerId, userId: likeData.userId },
                likeData,
            );

            const likeCount = await Like.countDocuments({ markerId: likeData.markerId });

            const countOfPositive = (
                await Like.find({ markerId: likeData.markerId, isPositive: true })
            ).length;

            await Marker.updateOne(
                { _id: likeData.markerId },
                { $set: { rating: 2 * countOfPositive - likeCount } },
            );

            res.json({ message: 'Like was updated!', newRating: 2 * countOfPositive - likeCount });
        } else {
            await Like.deleteOne({ markerId: likeData.markerId, userId: likeData.userId });

            const likeCount = await Like.countDocuments({ markerId: likeData.markerId });

            const countOfPositive = (
                await Like.find({ markerId: likeData.markerId, isPositive: true })
            ).length;

            await Marker.updateOne(
                { _id: likeData.markerId },
                { $set: { rating: 2 * countOfPositive - likeCount } },
            );

            res.json({ message: 'Like was updated!', newRating: 2 * countOfPositive - likeCount });
        }
    }
});

likes.post('/complaints/remove', async (req, res) => {
    const { ids } = req.body;

    const markerIds = ids.map((item) => item._id);

    await Like.deleteMany({
        markerId: {
            $in: markerIds,
        },
    });

    res.json({ result: true });
});

likes.delete('/authorities/:id', async (req, res) => {
    const id = req.params.id;

    const likes = await Like.findOne({ userId: id }, { id: 1 });

    await Like.deleteMany({ userId: id });

    res.json({ likes });
});

module.exports = likes;
