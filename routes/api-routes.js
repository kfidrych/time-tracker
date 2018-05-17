var db = require("../models");
var passport = require("passport");
var db = require("../models");

module.exports = function (app) {

    // app.get('/auth/google',
    //     passport.authenticate('google', { scope: ['profile'] }));

    // app.get('/auth/google/callback',
    //     passport.authenticate('google', { failureRedirect: '/login' }),
    //     function (req, res) {
    //         // Successful authentication, redirect home.
    //         res.redirect('/');
    //     });

    app.get('/',
        function (req, res) {
            res.render('index', { user: req.user });
        });

    app.get('/login',
        function (req, res) {
            res.render('index');
        });

    app.get('/login/google',
        passport.authenticate('google'));

    app.get('/login/google/return',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

    app.get('/profile',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            res.render('profile', { user: req.user });
        });
}