//Routes/sauce.js

const express = require('express');
const router = express.Router();
const sauceCtrl = require('../Controllers/sauce');

const auth = require('../Middleware/auth');
const multer = require('../Middleware/multer-config');

router.get('/',auth, sauceCtrl.getAllSauce);     //Renvoie le tableau de toutes les sauces dans BdD
router.get('/:id', auth, sauceCtrl.getOneSauce); // Renvoie la sauce avec ID fourni
router.post('/', auth, multer, sauceCtrl.createSauce);  //Crée une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);    //Modifier une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Supprime la sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce); // Liker la sauce


module.exports = router;
