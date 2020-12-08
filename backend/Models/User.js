const mongoose = require('mongoose');   // Tool for exchanging datas with MongoDB
const uniqueValidator = require('mongoose-unique-validator');// Only ONE email possible in database

const userSchema = mongoose.Schema({
    email: { type: String, required: true,unique:true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);