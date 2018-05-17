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

<<<<<<< HEAD
    app.get('/profile',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            res.render('profile', { user: req.user });
        });
=======
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'credentials.json';

module.exports = function (app) {

    app.post("/api/test", (req, res) => {
        db.Test.create({
            name: req.body.name,
            email: req.body.email
        }).then(dbTest => {
            res.json(dbTest);
        })
    });

    app.post("/api/auth", (req, res) => {
        var userToken = req.body.token;

        try {
            const content = fs.readFileSync('client_secret.json');
            authorize(JSON.parse(content), userToken, listEvents);
            res.end();
        } catch (err) {
            return console.log('Error loading client secret file:', err);
        }
    })

    function authorize(credentials, idToken, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        let token = {};
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        try {
            token = fs.readFileSync(TOKEN_PATH);
        } catch (err) {
            return getAccessToken(oAuth2Client, idToken, callback);
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    }

    function getAccessToken(oAuth2Client, idToken, callback) {
        oAuth2Client.setCredentials(idToken);
        // Store the token to disk for later program executions
        try {
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(idToken));
            console.log('Token stored to', TOKEN_PATH);
        } catch (err) {
            console.error(err);
        }
        callback(oAuth2Client);
    }

    /**
    * Lists the next 10 events on the user's primary calendar.
    * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
    */
    function listEvents(auth) {
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, { data }) => {
            if (err) return console.log('The API returned an error: ' + err);
            const events = data.items;
            if (events.length) {
                console.log('Upcoming 10 events:');
                events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    console.log(`${start} - ${event.summary}`);
                });
            } else {
                console.log('No upcoming events found.');
            }
        });
    }
>>>>>>> c4be90bb3a2c70105b17da65f92809bb1173c227
}