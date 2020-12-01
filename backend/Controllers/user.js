//Controllers/user.js
const bcrypt = require('bcrypt');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');
//const validator = require('node-email-validation');
const search = require('regex-collection'); // Pour valider l'adresse email
const passwordValidator = require('password-validator');     // Pour exiger mot de passe fort
const profilPassword = new passwordValidator();

// Propriétés du password
profilPassword
    .is().min(8)            // longueur mini=8
    .is().max(50)            // longueur maxi=50
    .has().uppercase()            // Majuscules imposées
    .has().lowercase()            // Minuscules imposées
    .has().digits()            // Nombres imposés
    .has().not().spaces()            // Pas d'espaces
   /* .has().not(/$/);  */             // Pas de $




//CREATION NOUVEL UTILISATEUR
//cryptage du password et sauvegarde dans BdD
exports.signup = (req, res, next) => {
    console.log("password :" + profilPassword.validate(req.body.password));
    console.log("password :" + profilPassword.validate(req.body.password, { list: true }));
    if (!profilPassword.validate(req.body.password)) {
        return res.status(401).json({ error: 'Mot de passe pas assez fort !' });
        console.log("Mot de passe pas assez fort !");
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            console.log("email : "+search.isEmailAddress(req.body.email));
            if (!search.isEmailAddress(req.body.email)) {
            //if (!validator.is_email_valid(req.body.email)){
                return res.status(401).json({ error: 'Email non valide !' });
            }
            const user = new User({
                email: sha1(req.body.email),
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur cree !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// vérification que le user est dans la BdD - vérif mot de passe
exports.login = (req, res, next) => {
    User.findOne({ email: sha1(req.body.email) })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};