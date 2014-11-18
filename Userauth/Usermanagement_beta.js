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

//login
app.get('/login', function(request, response) {
    var usr = request.query.usr;
    var thepass = crypto.createHash('md5').update(request.query.pass).digest('hex');
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Get angefordert für den User " +usr);
       if (c < 1) {
          console.log("User not found or password incorrect");
          response.end("User not found");
          console.log("");
       }
       
       if (c == 1) {
          console.log("Der User " +usr+" hat sich gerade eingeloggt");
          console.log("");
          User.find({username: usr, pass: thepass}, function (err, d) {
             response.json(d);
          });
       }

       else {
          console.log("Unexpected error, more than one user with your username");
          response.end("Fatal error! :D");
       }
    });
});


//get (nach usr)
app.get('/get', function(request, response) {
    var usr = request.query.usr;
    var thepass = request.query.pass;
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Get angefordert für den User " +usr);
       if (c < 1) {
          console.log("User not found or password incorrect");
          response.end("User not found");
          console.log("");
       }
       
       if (c == 1) {
          console.log("Login ok");
          Todo.find({user: usr}, function (err, Todos) {
             console.log("Got all the Todos for the user " +usr);
             console.log("");
             response.json(Todos);
          });
       }
       else {
          console.log("Unexpected error, more than one user with your username");
          response.end("Fatal error! :D");
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
          console.log("");
          response.end("I have added the following: " +b);
       }
       else {
          response.end("This username is already taken!");
          console.log("This username is already taken: " +usr);
          console.log("");
          
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
          console.log("User not found");
          response.end("Userauthentication not passed");
          console.log("");
       }
       
       if (c == 1) {
          console.log("Login ok");
          var b = new Todo({name: text, user: usr});
          b.save();
          console.log("Added" + b);
          console.log("");
          response.json(b);
       }
       
       else {
          console.log("Unexpected error, more than one user with your username");
          response.end("Fatal error...");
       }
    });
});

//remove
app.get('/rmv', function(request, response) {
    var id = request.query.id;
    var usr = request.query.usr;
    var thepass = request.query.pass;
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Rmv angefordert für den User " +usr);
       if (c < 1) {
          console.log("User not found");
          response.end("Something went wrong");
          console.log("");   
       }
       
       if (c == 1) {
          console.log("Login ok");
          Todo.remove({_id:id}, function(err) {
             console.log("Removed the Todo with the id " + id);
             console.log("");
             response.end("Removed the Todo with the id " + id);
          });
       }
       
       else {
          console.log("Unexpected error, more than one user with your username");
          response.end("Fatal error");
       }
    });
});

//update
app.get('/update', function(request, response) {
    var id = request.query.id;
    var usr = request.query.usr;
    var thepass = request.query.pass;
    var updatedtext = request.query.new;
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Update angefordert für den User " +usr);
       if (c < 1) {
          console.log("User not found");
          response.end("Something went wrong");
          console.log("");   
       }
       
       if (c == 1) {
          console.log("Login ok");
          Todo.findOne({ user: usr, _id:id }, function (err, doc){
             doc.name = updatedtext;
             doc.save();
             response.json(doc);
             console.log("Updated a Todo for the user " +usr); 
             console.log("");  
          });
       }
       
       else {
          console.log("Unexpected error, more than one user with your username");
          response.end("Fatal error");
       }
    });
});



//run
app.listen(8080);
console.log("Running on Port 8080");
