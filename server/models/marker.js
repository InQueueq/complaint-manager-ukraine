const mongoose = require('mongoose');

const MarkerSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    longitude: Number,
    latitude: Number,
    creator: mongoose.Schema.Types.ObjectId,
    inProcess: Boolean,
    region: mongoose.Schema.Types.ObjectId,
    rating: Number
});

const Marker =  mongoose.model('markers', MarkerSchema);

module.exports = Marker;