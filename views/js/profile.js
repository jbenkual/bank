$(document).foundation();
var negative = false;
var accountId = "";
var setData = function(bool, accnt) { 
  if(bool) {
    $('#confirm').text("Make Withdrawl");
  }
  else {
    $('#confirm').text("Make Deposit");
  }
  negative = bool;
  accountId = accnt;
};
var transaction = function() {
  var data = { 
    amount: $("#amount").val(), 
    description: $("#desc").val(),
    name: negative ? "Withdrawal" : "Deposit",
    account: accountId
  };
   // if(negative) { data.amount = "-" + data.amount}
    //console.log(data);
  $.post("/user/transaction", data)
  .done( function(){
    $('#myModal').foundation('reveal', 'close'); 
    console.log("success");
  })
  .fail(function (err) {
    console.err("Error: ", err);
  });
};

$(document).ready(function () {
  $("#cancel").on('click', function() {
    $('#myModal').foundation('reveal', 'close'); 
  });
  $("#confirm").on('click', transaction);
  $(".amount").each(function() {
    if(parseFloat($(this).text()) > 0) {
      $(this).addClass("red");
    }
  });
});


