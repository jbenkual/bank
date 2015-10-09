// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

// load up the user model
var User       = require('../app/models/user');
var Account       = require('../app/models/account').account;
var Transaction       = require('../app/models/account.js').transaction;


module.exports = function(passport) {

    // =============================ƒ============================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id).populate({path: 'accounts'}).exec(function(err, user) {
            Account.populate(user, {path: 'accounts.transactions', model: Transaction}, function(err, data) {
                console.log("data2", data);
                console.log("data", user);
            done(err, user);
            })
            
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'email' :  email })
            .exec(function(err, user) {
                
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user || !user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'You are oinking up the wrong bank!'));


                // all is well, return user
                else
                    return done(null, user);
                    
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        fullnameField : 'name',
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That little piggy already went to the bank.'));
                    } else {
                        
                        // create the user
                        var newUser            = new User();

                        newUser.name     = req.body.name;
                        newUser.email    = email;
                        newUser.password = newUser.generateHash(password);
                        console.log('new', newUser);

                        // create checking account
                        newAccnt = new Account();
                        newAccnt.name = "Checking";
                        newAccnt.balance = 0.0;
                        newUser.accounts.push(newAccnt);

                        newAccnt.save(function(err) {
                            if(err)
                                console.error("This place is a sty! Come back later.");
                        });

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else if ( !req.user.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var loadedUser = req.user;
                        loadedUser.name = req.body.name;
                        loadedUser.email = email;
                        loadedUser.password = loadedUser.generateHash(password);
                        loadedUser.save(function (err) {
                            if (err)
                                return done(err);
                            
                            return done(null,loadedUser);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));
};
