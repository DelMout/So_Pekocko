const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./Routes/user');
const sauceRoutes = require('./Routes/sauce');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const app = express();


//Connection à la base de données MongoDB
mongoose.connect('mongodb+srv://'+process.env.USER+':'+process.env.PASSWORD+'@cluster0.ki5qr.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion a MongoDB reussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



//Securité CORS
app.use(cors());


app.use(bodyParser.json());
app.use(helmet());

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




