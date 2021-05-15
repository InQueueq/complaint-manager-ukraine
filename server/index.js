require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

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
app.use('/users', users);

app.listen(PORT, () => console.log(`Server started on ${PORT} port`));
