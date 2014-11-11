var express = require('express');
var crypto = require('crypto');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var User = require('./model/Userschema.js');

//get (nach usr)
app.get('/get', function(request, response) {
    var usr = request.query.usr;
    User.find({username: usr}, function (err, Users) {
       console.log(Users);
       response.json(Users);
    });
});

//put (m usr und text)
app.get('/put', function(request, response) {
    var usrname = request.query.usr;
    var thepass = crypto.createHash('md5').update(request.query.pass).digest('hex');
    var b = new User({ username: usrname, pass: thepass});
    b.save();
    console.log("Added " +b);
    response.end("I have added the following: " +b);
});

app.listen(8080);
console.log("node express app started at http://localhost:8080");
