// load the things we need
var mongoose = require('mongoose');



var transactionSchema = mongoose.Schema({
  name          : String,
  description   : String,
  sender        : String,
  recipient     : String,
  date          : Date,
  senderId      : {type: mongoose.Schema.ObjectId, ref: 'UserSchema'},
  recipientId   : {type: mongoose.Schema.ObjectId, ref: 'UserSchema'},
  amount       : Number
});

exports.transactionSchema = transactionSchema;
exports.transaction = mongoose.model('transaction', transactionSchema);


var accountSchema = mongoose.Schema({
  name          : String,
  balance       : String,
  transactions  : [{type: mongoose.Schema.ObjectId, ref: 'TransactionSchema'}]
});

exports.accountSchema = accountSchema;
accountSchema.methods.calcBalance = function() {
    this.balance = this.transactions.reduce(function (a,b) { return a+b.amount}, 0);
};

exports.account = mongoose.model('account', accountSchema);


