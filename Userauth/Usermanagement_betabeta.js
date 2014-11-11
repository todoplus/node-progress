//Module
var express = require('express');
var crypto = require('crypto');
var app = express();
var mongoose = require('mongoose');

//DB-Connection
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');

//MongoDB-Schemas
var User = require('./model/Userschema.js');
var Todo = require('./model/Todoschema.js');

//get (nach usr)
app.get('/get', function(request, response) {
    var usr = request.query.usr;
    var thepass = request.query.pass;
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Get angefordert für den User " +usr);
       if (c < 1) {
          console.log("User not found");
       }
       
       if (c == 1) {
          console.log("Login ok");
          Todo.find({user: usr}, function (err, Todos) {
             console.log("Got all the following Todos for the user " +usr);
             console.log(Todos);
             response.json(Todos);
          });
       }
       else {
          console.log("Unexpected error, more than one user with your username");
       }
    });
});

// Registrierung mit parameter in klartext, der dann in md5 verschlüsselt wird
// Nennemers verschlüssle :D
app.get('/createuser', function(request, response) {
    var usr = request.query.usr;
    var thepass = crypto.createHash('md5').update(request.query.pass).digest('hex');
    var number = User.count({username: usr}, function(err, c) {
       if (c < 1) {
          var b = new User({ username: usr, pass: thepass});
          b.save();
          console.log("Added the user: " +b);
          response.end("I have added the following: " +b)
       }
       else {
          response.end("Your username is already taken!");
          console.log("This username is already taken: " +usr);
       }
    });
});

//Put - und ja das wird kritisch
app.get('/put', function(request, response) {
    var usr = request.query.usr;
    var thepass = request.query.pass;
    var text = request.query.text;
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Put angefordert für den User " +usr);
       if (c < 1) {
          console.log("User not found")
          
       }
       
       if (c == 1) {
          console.log("Login ok");
          var b = new Todo({name: text, user: usr});
          b.save();
          console.log("Added" + b);
          response.json(b);
       }
       
       else {
          console.log("Unexpected error, more than one user with your username")
       }
    });
});


app.listen(8080);
console.log("node express app started at http://localhost:8080");
