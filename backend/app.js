const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./Routes/user');
const sauceRoutes = require('./Routes/sauce');
const path = require('path');


//Connection à la base de données MongoDB
mongoose.connect('mongodb+srv://Delph:delf4949@cluster0.ewlyb.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion a MongoDB reussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//Securité CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(bodyParser.json());

// Images
app.use('/images', express.static(path.join(__dirname, 'images')));


// Inscription nouveau user
app.use('/api/auth', userRoutes);

// les Sauces
app.use('/api/sauces', sauceRoutes);


// Voir si la requête est bien exécutée
app.use('/api/auth/signup', (req, res, next) => {
    res.json({ message: 'Votre requete a bien ete recue !' });
});
module.exports = app;