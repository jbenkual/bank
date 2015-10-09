$(document).foundation();
var negative = false;
var accountId = "";
var setData = function(type, accnt) { 
  if(type === 1) {
    $('#confirm').text("Make Withdrawl");
    $('#recipientLabel').hide();
    $('#recipient').hide();
  }
  else if(type === 2) {
    $('#confirm').text("Make Deposit");
    $('#recipientLabel').hide();
    $('#recipient').hide();
  }
  else {
    $('#confirm').text("Make Transfer");
    $('#recipientLabel').show();
    $('#recipient').show();
  }

  negative = type === 2;
  accountId = accnt;
};
var transaction = function() {
  var amount = parseFloat($("#amount").val());
  console.log(typeof amount);
  var data = { 
    amount: amount, 
    description: $("#desc").val(),
    name: negative ? "Withdrawal" : "Deposit",
    type: negative ? "Withdrawal" : "Deposit",
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
    console.error("Error: ", err);
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


