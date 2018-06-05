// app/routes.js

var user = require('../controllers/user.controller');


module.exports = function (app, passport) {

    //set defalut rul to login
    app.get('/', (req, res) =>{
        res.redirect('/login');
    });

    //login render
    app.get('/login', (req, res) => {

        if (req.isAuthenticated())
        {
            res.redirect('/profile');

        }else {
            // render the page and pass in any flash data if it exists
            res.render('login.ejs', {message: req.flash('loginMessage')});
        }
    });

    //authenticate login
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    //render signup
    app.get('/signup', (req, res) =>{
        if (req.isAuthenticated())
        {
            res.redirect('/profile');

        }else {
            // render the page and pass in any flash data if it exists
            res.render('signup.ejs', {message: req.flash('signupMessage')});
        }
    });

    //authenticate signup
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    //render profile
    app.get('/profile', isLoggedIn, (req, res) => {
        user.getUserDetails(req.user.id, res).then((data) => {
            res.render('profile.ejs', {
                session: req.sessionID,
                user: data.local,
                user_id: data._id,
                updated:0
            });
        })
            .catch((e) => {
                res.status(400).send(e);
            });
    });

    //update profile
    app.post('/profile', isLoggedIn, (req, res) => {
        user.update(req, res).then((data) => {
            res.render('profile.ejs', {
                session: req.sessionID,
                user: data.local,
                user_id: data._id,
                updated:1
            });
        })
            .catch((e) => {
                res.status(400).send(e);
            });
    });

    //logout
    app.get('/logout', (req, res) =>{
        req.logout();
        res.redirect('/');
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
