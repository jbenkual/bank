// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var account = require('./account.js').account;
var transaction = require('./account.js').transaction;


// define the schema for our user model
var userSchema = mongoose.Schema({
    name         : String,
    email        : String,
    password     : String,
    accounts      : [{type: mongoose.Schema.ObjectId, ref: 'account'}]

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
