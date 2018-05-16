var express = require("express");
var db = require("./models");
var passport = require("passport");
var Strategy = require("passport-google-oauth20").Strategy;
var sequelize = require("sequelize");

var bodyParser = require("body-parser");

var PORT = process.env.PORT || 8080;

passport.use(new Strategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/login/google/return'
},
  function (accessToken, refreshToken, profile, cb) {
    db.User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function (user, cb) {
  db.User.create(user).then(function(result) {
    cb.json(result);
    console.log(result);
  })
});

passport.deserializeUser(function (obj, cb) {
  db.User.destroy({
    where: {
      id: obj.id
    }
  }).then(function(result) {
    cb.json(result);
    console.log(result);
  })
});

var app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(passport.initialize());
app.use(passport.session());

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);


db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
  });
})
