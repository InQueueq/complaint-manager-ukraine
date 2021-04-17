const mongoose = require('mongoose');

const RegionSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    longitude: Number,
    latitude: Number
});

const Region =  mongoose.model('regions', RegionSchema);

module.exports = Region;