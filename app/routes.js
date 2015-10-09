var Account = require('./models/account.js').account;
var Transaction = require('./models/account.js').transaction;

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        console.log(req.url);
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        console.log(req.user);
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/user/transaction', isLoggedIn, function(req, res) {
        var user            = req.user;
        var newT            = new Transaction();
        if(typeof req.body.amount !== 'number') {
            res.status(400).send({error: "Invalid transfer amount"});
            return;
        }
        newT.name = req.body.name;
        newT.amount = Math.abs(req.body.amount);
        newT.date = Date.now();
        newT.sender = req.body.sender;
        newT.recipient = req.body.recipient;
        newT.description = req.body.description;

        if(req.body.type === "Withdrawl") {
            newT.amount = -1 * Math.abs(newT.amount);
        }

        console.log("newT: ", newT);

        newT.save(function(err) {
            console.log(user.accounts);
            var account = user.accounts[0];
            account.transactions.push(newT._id);
            account.save(function(err) {
                console.log(account);
            });
            res.status(200).send({success: "Your money is safe with us!"});
        });
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

   
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
