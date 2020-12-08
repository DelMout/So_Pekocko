//Controllers/user.js
const bcrypt = require('bcrypt');   // To crypt password and email address
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');       // File system
const search = require('regex-collection'); // To check conformity of email address
const passwordValidator = require('password-validator');     // To obtain strong password
const profilPassword = new passwordValidator();


// Profil of password
profilPassword
    .is().min(10)            // length mini=10
    .is().max(50)            // length maxi=50
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not(/\$|=|'|\./)      // Nonauthorized : =  '   $ .



//CREATION of a NEW USER
//To crypt password and email address. Save of crypted datas in database MongoDB
exports.signup = (req, res, next) => {
    if (!profilPassword.validate(req.body.password)) {
        return res.status(401).json({ error: 'Password not enough strong ! Requirements not meet :' + profilPassword.validate(req.body.password, { list: true }) });
    }
    bcrypt.hash(req.body.password, 10)
        .then(hashPassword => {
            if (!search.isEmailAddress(req.body.email) || req.body.email.indexOf("$") === 0) {   // Email commencing by  par '.' excluded in regex-collection OR email commencing by '$'
                return res.status(401).json({ error: 'Email nonauthorized !' });
            }
            bcrypt.hash(req.body.email, 10)
                .then(hashEmail => {
                    const user = new User({
                        email: hashEmail,
                        password: hashPassword
                    });
                    user.save()
                        .then(() => res.status(201).json({ message: 'User saved !' }))
                        .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));

        })
        .catch(error => res.status(500).json({ error }));
};


// Check user in database. Check password
exports.login = (req, res, next) => {
    User.find()
        .then(
            (users) => {
                let emailNotFound = 0;
                for (let user of users) {
                    bcrypt.compare(req.body.email, user.email)
                        .then(valid => {
                            if (valid) {
                                bcrypt.compare(req.body.password, user.password)
                                    .then(valid => {
                                        if (!valid) {
                                            return res.status(401).json({ error: 'Password not OK !' });
                                        }
                                        res.status(200).json({
                                            userId: user._id,
                                            token: jwt.sign(
                                                { userId: user._id },
                                                'RANDOM_TOKEN_SECRET',
                                                { expiresIn: '1h' }
                                            )
                                        });
                                    })
                                    .catch(error => res.status(500).json({ error }));
                            } else {
                                emailNotFound++;
                                if (emailNotFound == users.length) {
                                    res.status(401).json({ error: 'Email not found !' });
                                }
                            }
                        })
                        .catch(error => res.status(401).json({ error: 'Email not found !' }));
                }
            })
}