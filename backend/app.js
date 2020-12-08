require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./Routes/user');
const sauceRoutes = require('./Routes/sauce');
const cors = require('cors');       //Security CORS
const path = require('path');
const helmet = require('helmet');       // Protect HTTP headers
const app = express();


//Connection to database MongoDB
mongoose.connect('mongodb+srv://' + process.env.USER + ':' + process.env.PASSWORD + '@cluster0.ki5qr.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connection on MongoDB done !'))
    .catch(() => console.log('Connection on MongoDB failed !'));

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

// Images
app.use('/images', express.static(path.join(__dirname, 'images')));

// User
app.use('/api/auth', userRoutes);

// Sauces
app.use('/api/sauces', sauceRoutes);

module.exports = app;




