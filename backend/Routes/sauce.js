//Routes/sauce.js

const express = require('express');
const router = express.Router();
const sauceCtrl = require('../Controllers/sauce');

const auth = require('../Middleware/auth'); // Authentification user with token
const multer = require('../Middleware/multer-config');  // Package multer for uploading files (images)
const ident = require('../Middleware/ident-user');  //Identify if user connected is the sauce creator


router.get('/', auth, sauceCtrl.getAllSauce);     //See all sauces
router.get('/:id', auth, sauceCtrl.getOneSauce); // See one sauce with Id
router.post('/', auth, multer, sauceCtrl.createSauce);  //Create a sauce
router.put('/:id', auth, ident, multer, sauceCtrl.modifySauce);    //Modify a sauce
router.delete('/:id', auth, ident, sauceCtrl.deleteSauce); // Delete a sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce); // Like/Dislike a sauce


module.exports = router;
