const mongoose = require('mongoose');

// Stop warnings during connection on MongoDB
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },    
    imageUrl: { type: String,required:true},
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: [String],
    usersDisliked: [String],
});

module.exports = mongoose.model('Sauce', sauceSchema);