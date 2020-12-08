//Identify if user connected is the sauce creator

const Sauce = require('../Models/Sauce');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(
            (sauce) => {
                try {
                    const token = req.headers.authorization.split(' ')[1];
                    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                    const userConnected = decodedToken.userId;
                    const userCreator = sauce.userId;
                    if (userConnected !== userCreator) {
                        throw 'Connected user is not the sauce creator';
                    } else {
                        next();
                    }
                } catch {
                    res.status(401).json({
                        error: 'Unauthorized !'
                    });
                }
            })
        .catch(error => res.status(400).json({ error }));

};

