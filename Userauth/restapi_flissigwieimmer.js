//Module laden
var express = require('express');
var crypto = require('crypto');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Status-Codes
var stat000 = "000 - Login ok";
var stat001 = "001 - Login failed";
var stat002 = "002 - Username already taken";
var stat003 = "003 - Removing ok";
var stat004 = "004 - No Todo with this ID found for you";

//SALT-Encryption
var salter="Salz123Stange";

//body-parser Konfiguration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB-Connection aufbauen
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');

//MongoDB-Schemas importieren
var User = require('./model/Userschema2.js');
var Todo = require('./model/Todoschema2.js');

//User erstellen mit POST-Anfrage
app.post('/api/create', function(req, res) {
    var usr = req.body.usr;
    var thepass = crypto.createHash('sha512').update(req.body.pass+salter).digest('hex');
    var number = User.count({username: usr}, function(err, c) {
       if (c < 1) {
          var b = new User({ username: usr, pass: thepass});
          b.save();
          console.log("Added the user: " +b);
          console.log("");
          res.json(b);
          res.end();
       }
       else {
          res.json(stat002);
          res.end();
          console.log("This username was requested and is already taken: " +usr);
          console.log("");
          
       }
    });
});



// login über POST-Anfrage
app.post('/api/login', function(req, res) {
   var usr = req.body.usr;
   var thepass = req.body.pass;
//Abgleich mit Login-Daten und c gleich wieviele User mit dieser Kombination
   var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("Loginversuch für den Usernamen " +usr);
       if (c == 1) {
          console.log(stat000);
          console.log("");
          User.find({username: usr, pass: thepass}, function (err, d) {
             res.json(d);
             res.end();
          });
       }

       else {
          console.log(stat001);
          console.log("");
          res.json(stat001);
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
       console.log("POST angefordert für den User " +usr);
       if (c == 1) {
          console.log(stat000);
          var b = new Todo({name: text, user: usr});
          b.save();
          console.log("Added" + b);
          console.log("");
          res.json(b);
          res.end();
       }
       
       else {
          console.log(stat001);
          res.json(stat001);
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
       console.log("PUT angefordert für den User " +usr);
       if (c == 1) {
//update, wenn login erfolgreich
          console.log(stat000);
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
          console.log(stat001);
          res.json(stat001);
          res.end();
       }
    });
});

app.delete('/api/:Todo_id', function(req, res) {
//authent und in body, id als param
    var usr = req.body.usr;
    var thepass = req.body.pass;
    var id = req.params.Todo_id;
//login-überprüfung
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("DELETE angefordert für den User " +usr);
       if (c == 1) {
//update, wenn login erfolgreich
          console.log(stat000);
          var number2 = Todo.count({user: usr, _id: id}, function(err, d) {
             if (d == 1) {
                Todo.remove({_id:id, user:usr}, function(err) {
                   console.log("Removed the Todo with the id " + id);
                   console.log("");
                   res.json("Removed the Todo with the id " + id);
                   res.end();
                });
             }
             else {
                console.log(stat004);
                console.log("");
                res.json(stat004);
                res.end();
             }
          });       
       }
       else {
          console.log(stat001);
          res.json(stat001);
          res.end();
       }
    });
});


//get (nach usr)
app.get('/api', function(req, res) {
    var usr = req.query.usr;
    var thepass = req.query.pass;
    var number = User.count({username: usr, pass: thepass}, function(err, c) {
       console.log("GET angefordert für den User " +usr);
       if (c == 1) {
          console.log(stat000);
          Todo.find({user: usr}, function (err, Todos) {
             console.log("Got all the Todos for the user " +usr);
             console.log("");
             res.json(Todos);
             res.end();
          });
       }
       else {
          console.log(stat001);
          res.end(stat001);
       }
    });
});


app.listen(8080);
console.log("Running on Port 8080");
