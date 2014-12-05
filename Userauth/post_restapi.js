//Module
var express = require('express');
var crypto = require('crypto');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//body-parser-setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB-Connection
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');

//MongoDB-Schemas
var User = require('./model/Userschema.js');
var Todo = require('./model/Todoschema.js');

app.post('/login', function(req, res) {
   var usr = req.body.usr;
   var thepass = req.body.pass;
   var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Loginversuch für den Usernamen " +usr);
       if (c < 1) {
          console.log("User not found or password incorrect");
          res.end("User not found");
          console.log("");
       }
       
       if (c == 1) {
          console.log("Der User " +usr+" hat sich gerade eingeloggt");
          console.log("");
          User.find({username: usr, pass: thepass}, function (err, d) {
             res.end("Login ok");
          });
       }

       else {
          console.log("Unexpected error, more than one user with your username");
          res.end("Fatal error! :D");
       }
    });
});

app.post('/post', function(req, res) {
    var usr = req.body.usr;
    var thepass = req.body.pass;
    var text = req.body.text;
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Put angefordert für den User " +usr);
       if (c < 1) {
          console.log("User not found");
          res.end("Userauthentication not passed");
          console.log("");
       }
       
       if (c == 1) {
          console.log("Login ok");
          var b = new Todo({name: text, user: usr});
          b.save();
          console.log("Added" + b);
          console.log("");
          res.json(b);
          res.end();
       }
       
       else {
          console.log("Unexpected error, more than one user with your username");
          res.end("Fatal error...");
       }
    });
});


app.listen(8080);
console.log("Running on Port 8080/api");
