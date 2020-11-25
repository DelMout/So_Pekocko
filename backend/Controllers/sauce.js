//Controllers/sauce.js
const Sauce = require('../Models/Sauce');
const fs = require('fs');




// Crée une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes:0
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};




// Renvoie la sauce avec ID fourni
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

// Modifie une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Supprime une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Renvoie toutes les sauces
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

// Liker une sauce
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const userIdLike = req.body.userId;

    if (like === 1 && (req.params.userId !== userIdLike)) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { likes: 1 },
                $push: { usersLiked: userIdLike }
            })
            .then(() => res.status(200).json({ message: 'Sauce likée !' }))
            .catch(error => res.status(400).json({ error }));
        console.log("t'as clique sur LIKE !");

    } else if (like === -1 && (req.params.userId !== userIdLike)) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: userIdLike },
            })
            .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
            .catch(error => res.status(400).json({ error }));
        console.log("t'as clique sur DISLIKE !");

    } else if (like === 0 && (req.params.userId !== userIdLike)) {
        if ({ usersLiked: { $in: [userIdLike] } }) {
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    $inc: { likes: -1 },
                    $pull: { usersLiked: userIdLike }
                })
                .then(() => res.status(200).json({ message: 'Sauce plus likée !' }))
                .catch(error => res.status(400).json({ error }));
            console.log("t'as décliqué sur LIKE !");
            
        } else if ({ usersDisliked: { $in: [userIdLike] } }) {
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: userIdLike }
                })
                .then(() => res.status(200).json({ message: 'Sauce plus dislikée !' }))
                .catch(error => res.status(400).json({ error }));
            console.log("t'as décliqué sur DISLIKE !");
        }
    }
        
          
};


        