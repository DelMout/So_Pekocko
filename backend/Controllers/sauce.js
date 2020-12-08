//Controllers/sauce.js
const Sauce = require('../Models/Sauce');
const fs = require('fs');



// Create a sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce saved !' }))

        .catch(error => res.status(400).json({ error }));
};


// See a sauce with given Id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

// Modify a sauce
exports.modifySauce = (req, res, next) => {

    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(
                (sauce) => {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => {
                                res.status(200).json({ message: 'Sauce changed and picture file replaced !' });
                            })
                            .catch(error => res.status(400).json({ error }));
                    });
                })
            .catch(error => res.status(400).json({ error }));
    } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => {
                res.status(200).json({ message: 'Sauce changed !' });
            })
            .catch(error => res.status(400).json({ error }));
    }

};

// Delete a sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce deleted !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// See all of the sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(
            (sauces) => {
                res.status(200).json(sauces);
            })
        .catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
};

// Liker/Disliker a sauce
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const userIdLike = req.body.userId;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const formerUserLike = sauce.usersLiked.indexOf(userIdLike); // -1 = not in the array of usersLiked
            const formerUserDislike = sauce.usersDisliked.indexOf(userIdLike); // -1 = not in the array of usersDisliked

            if (like === 1 && formerUserLike === -1) {   // User hasn't not liked already 
                Sauce.updateOne(
                    { _id: req.params.id },
                    { $push: { usersLiked: userIdLike }, $inc: { likes: 1 }, _id: req.params.id },
                )
                    .then(() => res.status(200).json({ message: 'Sauce liked !' }))
                    .catch(error => res.status(400).json({ error }));

            } else if (like === -1 && formerUserDislike === -1) { // User hasn't not disliked already 
                Sauce.updateOne(
                    { _id: req.params.id },
                    { $push: { usersDisliked: userIdLike }, $inc: { dislikes: 1 }, _id: req.params.id },
                )
                    .then(() => res.status(200).json({ message: 'Sauce disliked !' }))
                    .catch(error => res.status(400).json({ error }));

            } else if (like === 0 && (formerUserLike > -1 || formerUserDislike > -1)) {
                if (formerUserLike > -1) {    // User has already liked
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $pull: { usersLiked: userIdLike }, $inc: { likes: -1 }, _id: req.params.id },
                    )
                        .then(() => res.status(200).json({ message: 'Sauce not liked anymore !' }))
                        .catch(error => res.status(400).json({ error }));

                } else if (formerUserDislike > -1) {    // User has already disliked
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $pull: { usersDisliked: userIdLike }, $inc: { dislikes: -1 }, _id: req.params.id },
                    )
                        .then(() => res.status(200).json({ message: 'Sauce not disliked anymore !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        }
        )
        .catch(error => res.status(400).json({ error }))
}