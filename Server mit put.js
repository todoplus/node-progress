var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var Brot = require('./model/Brotschema.js');

app.get('/put', function(request, response) {
    var usr = request.query.usr;
    var text = request.query.text;
    response.end("I have received: " + usr + text);
    var b = new Brot({ name: text, user: usr});
    b.save();
    console.log(b);
    console.log("Added " +text +usr);

});

app.listen(8080);
console.log("node express app started at http://localhost:8080");