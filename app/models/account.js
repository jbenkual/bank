// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
exports.accountSchema = mongoose.Schema({
  name          : String,
  balance       : String,
  transactions  : [{type: mongoose.Schema.ObjectId, ref: 'TransactionSchema'}]
});


exports.transactionSchema = mongoose.Schema({
  sender        : String,
  recipient     : String,
  senderId      : {type: mongoose.Schema.ObjectId, ref: 'UserSchema'},
  recipientId   : {type: mongoose.Schema.ObjectId, ref: 'UserSchema'},
  amount       : Number
});