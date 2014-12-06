//Module laden
var express = require('express');
var crypto = require('crypto');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//body-parser Konfiguration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB-Connection aufbauen
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');

//MongoDB-Schemas importieren
var User = require('./model/Userschema2.js');
var Todo = require('./model/Todoschema2.js');

// login über POST-Anfrage
app.post('/api/login', function(req, res) {
   var usr = req.body.usr;
   var thepass = req.body.pass;
//Abgleich mit Login-Daten und c gleich wieviele User mit dieser Kombination
   var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Loginversuch für den Usernamen " +usr);
       if (c < 1) {
          console.log("User not found or password incorrect");
          console.log("");
          res.json("Login failed");
          res.end();
       }
       
       if (c == 1) {
          console.log("Der User " +usr+" hat sich gerade eingeloggt");
          console.log("");
          //User.find({username: usr, pass: thepass}, function (err, d) {
          res.json("Login ok");
          res.end();
          //});
       }

       else {
          console.log("Unexpected error, more than one user with your username");
          res.json("Fatal error! :D");
          res.end();
       }
    });
});

//POST
app.post('/api', function(req, res) {
    var usr = req.body.usr;
    var thepass = req.body.pass;
    var text = req.body.text;
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Put angefordert für den User " +usr);
       if (c < 1) {
          console.log("User not found");
          res.json("Userauthentication not passed");
          res.end();
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
          res.json("Fatal error...");
          res.end();
       }
    });
});

//put
app.put('/api/:Todo_id', function(req, res) {
//authent und text in body, id als param
    var usr = req.body.usr;
    var thepass = req.body.pass;
    var updatedtext = req.body.text;
    var id = req.params.Todo_id;
//login-überprüfung
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Put angefordert für den User " +usr);
       if (c < 1) {
          console.log("User not found");
          res.json("Userauthentication not passed");
          res.end();
          console.log("");
       }
       
       if (c == 1) {
//update, wenn login erfolgreich
          console.log("Login ok");
          Todo.findOne({ user: usr, _id:id }, function (err, doc){
             doc.name = updatedtext;
             doc.save();
             res.json(doc);
             res.end();
             console.log("Updated a Todo for the user " +usr); 
             console.log("");  
          });
       }

       
       else {
          console.log("Unexpected error, more than one user with your username");
          res.json("Fatal error...");
          res.end();
       }
    });
});

//get (nach usr)
app.get('/api', function(req, res) {
    var usr = req.query.usr;
    var thepass = req.query.pass;
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Get angefordert für den User " +usr);
       if (c < 1) {
          console.log("User not found or password incorrect");
          res.end("User not found");
          console.log("");
       }
       
       if (c == 1) {
          console.log("Login ok");
          Todo.find({user: usr}, function (err, Todos) {
             console.log("Got all the Todos for the user " +usr);
             console.log("");
             res.json(Todos);
             res.end();
          });
       }
       else {
          console.log("Unexpected error, more than one user with your username");
          res.end("Fatal error! :D");
       }
    });
});


app.listen(8080);
console.log("Running on Port 8080");
