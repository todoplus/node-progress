var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var Brot = require('./model/Brotschema.js');
var express = require('express');
var app = express();
//Brot.find({user: "testuser"}, function (err, Brots) {
//   console.log(Brots);
//});

app.get('/get', function(request, response) {
    var usr = request.query.usr;
    Brot.find({user: "testuser"}, function (err, Brots) {
       console.log(Brots);
       response.json(Brots);
       });
    console.log("Got all Todos for the user " +usr);
});

    

app.listen(8080);
console.log("node express app started at http://localhost:8080");



