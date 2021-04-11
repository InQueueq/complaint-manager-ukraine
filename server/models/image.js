const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    image: String,
    markerId: mongoose.Schema.Types.ObjectId
});

const Image =  mongoose.model('images', ImageSchema);

export { Image };