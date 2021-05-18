const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const path = require('path');
const fs = require('fs-extra');
const Image = require('../models/image.js');

const Busboy = require('busboy');

const images = express.Router();

images.use(cors());

function processImages(req) {
    return new Promise((resolve, reject) => {
        const busboy = new Busboy({ headers: req.headers });
        const images = [];

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const saveTo = path.join(__dirname, '../../client/public') + '/images/' + filename;

            file.on('end', () => {
                const imageInfo = {
                    image: '/images/' + filename,
                    markerId: filename.split('_')[0],
                };
                images.push(imageInfo);
            });

            file.pipe(fs.createWriteStream(saveTo));
        });

        busboy.on('finish', function () {
            resolve(images);
        });

        req.pipe(busboy);
    });
}

images.post('/', async (req, res) => {
    const result = await processImages(req);

    const images = await Promise.all(
        result.map((image) => {
            return new Promise((resolve, reject) => {
                resolve(Image.create(image));
            });
        }),
    );

    if (images.length) {
        res.json({ message: 'Images were successfully uploaded', images });
    } else {
        res.json({ message: 'Images were not uploaded' });
    }
});

images.get('/:id', async (req, res) => {
    const id = req.params.id;

    const markerImages = await Image.find({ markerId: id });

    if (markerImages.length) {
        res.json({ message: 'Images are found!', markerImages });
    } else {
        res.json({ message: 'Images not found' });
    }
});

module.exports = images;
