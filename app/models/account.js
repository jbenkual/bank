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
  amount        : Number,
  type          : String
});

exports.transactionSchema = transactionSchema;
var Transaction = mongoose.model('transaction', transactionSchema);
exports.transaction = Transaction;


var accountSchema = mongoose.Schema({
  name          : String,
  balance       : String,
  transactions  : [{type: mongoose.Schema.ObjectId, ref: 'TransactionSchema'}]
});

exports.accountSchema = accountSchema;
accountSchema.methods.calcBalance = function() {
  console.log('\n\n\n ----------------\n\n calculate balance\n\n ---------------\n\n\n')
  Transaction.populate(this, {path: "transactions"}, function(err, account) {
    account.balance = account.transactions.reduce(function (a,b) { 
      console.log(typeof a, a, typeof b.amount, b.amount);
      return a+b.amount
    }, 0);
    account.save();
  });  
};

exports.account = mongoose.model('account', accountSchema);


