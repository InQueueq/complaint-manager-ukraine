require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const busboy = require('connect-busboy');
const path = require('path');

const app = express();

app.use(express.json());
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));

const users = require('./routes/users');
const regions = require('./routes/regions');
const complaints = require('./routes/complaints');
const images = require('./routes/images');
const likes = require('./routes/likes');
const admin = require('./routes/admin');

app.use('/users', users);
app.use('/regions', regions);
app.use('/complaints', complaints);
app.use('/images', images);
app.use('/likes', likes);
app.use('/admin', admin);

app.listen(PORT, () => console.log(`Server started on ${PORT} port`));
