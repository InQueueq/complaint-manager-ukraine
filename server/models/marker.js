const mongoose = require('mongoose');

const MarkerSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    longitude: Number,
    latitude: Number,
    creator: mongoose.Schema.Types.ObjectId,
    inProcess: Boolean,
    isMilitary: Boolean,
    region: mongoose.Schema.Types.ObjectId,
    rating: Number,
    createdAt: Number,
    expireAt: { type: Date, default: undefined },
});

MarkerSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Marker = mongoose.model('markers', MarkerSchema);

module.exports = Marker;
