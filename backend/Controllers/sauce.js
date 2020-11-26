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
        dislikes: 0,
        
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

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log("userIdLike = " + userIdLike);
            console.log("like = " + like);
            const dejaUserLike = sauce.usersLiked.indexOf(userIdLike); // -1 = n'est pas dans le tableau
            const dejaUserDislike = sauce.usersDisliked.indexOf(userIdLike); // -1 = n'est pas dans le tableau
            const userSauce = sauce.userId;
            console.log("Dans usersLiked = " + dejaUserLike);
          
            console.log("userSauce = " + userSauce);

            if ((dejaUserLike >= 0 && like===1)|| (dejaUserDislike >= 0 && like===-1) || userIdLike === userSauce) {     // User a déjà liké !
                console.log("t as deja (dis)liké ou tu es créateur de la sauce");
                Sauce.findOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Pas de modification car déjà (dis)liké ou tu as créé cette sauce !' }))
                    .catch(error => res.status(400).json({ error }));


            } else if (like === 1 && dejaUserLike === -1 && userIdLike !== userSauce) {   // Si user pas deja dans tableau Users(dis)Like et si différent du créateur sauce
                Sauce.updateOne(
                    { _id: req.params.id },
                    { $push: { usersLiked: userIdLike }, $inc: { likes: 1 }, _id: req.params.id }, 
                    console.log("Aime : userIdLike = " + userIdLike),
                )
                    .then(() => res.status(200).json({ message: 'Sauce likée !' }))
                    .catch(error => res.status(400).json({ error }));

                console.log("t'as clique sur LIKE !");

            } else if (like === -1 && dejaUserDislike === -1 && userIdLike !== userSauce) { // N'aime pas + 1er fois + n'est pas user créateur sauce
                Sauce.updateOne(
                    { _id: req.params.id },
                    { $push: { usersDisliked: userIdLike }, $inc: { dislikes: 1 }, _id: req.params.id }, 
                    console.log("N'aime pas : userIdLike = " + userIdLike),
                )
                    .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
                    .catch(error => res.status(400).json({ error }));

                console.log("t'as clique sur DISLIKE !");

            } else if (like === 0 && (dejaUserLike > -1 || dejaUserDislike > -1) ) {// Décliq la sélection
                if (dejaUserLike > -1) {    //Précédemment liké
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $pull: { usersLiked: userIdLike }, $inc: { likes: -1 }, _id: req.params.id }, 
                    )
                        .then(() => res.status(200).json({ message: 'Sauce plus likée !' }))
                        .catch(error => res.status(400).json({ error }));

                    console.log("t'as declique sur LIKE !");
                } else if (dejaUserDislike > -1) {    //Précédemment disliké
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $pull: { usersDisliked: userIdLike }, $inc: { dislikes: -1 }, _id: req.params.id },
                    )
                        .then(() => res.status(200).json({ message: 'Sauce plus dislikée !' }))
                        .catch(error => res.status(400).json({ error }));

                    console.log("t'as declique sur DISLIKE !");
                }
            }
        }
        )
        .catch(error => res.status(400).json({ error }))
}