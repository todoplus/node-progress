var express = require('express');
var crypto = require('crypto');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var User = require('./model/Userschema.js');
var Todo = require('./model/Todoschema.js');

//get (nach usr)
app.get('/get', function(request, response) {
    var usr = request.query.usr;
    var number = User.count({username: usr}, function(err, c) {
       console.log(c)
       })
    User.find({username: usr}, function (err, Users) {
       console.log(Users);
       response.json(Users);
    });
});

// (m usr und text)
app.get('/put', function(request, response) {
    var usrname = request.query.usr;
    var thepass = crypto.createHash('md5').update(request.query.pass).digest('hex');
    var number = User.count({username: usrname}, function(err, c) {
       console.log(c)
       if (c < 1) {
          var b = new User({ username: usrname, pass: thepass});
          b.save();
          console.log("Added the user: " +b);
          response.end("I have added the following: " +b)
       }
       else {
          response.end("Your username is already taken!");
          console.log("This username is already taken: " +usrname);
       }
    });
   
});

app.listen(8080);
console.log("node express app started at http://localhost:8080");
