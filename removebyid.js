var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var Brot = require('./model/Brotschema.js');

app.get('/rmv', function(request, response) {
    var id = request.query.id;
    Brot.remove({_id:id}, function(err){
       if(err) throw err;
       console.log("Removed the Todo with the id " + id);
       response.end("Removed the Todo with the id " + id);
    });
});

app.listen(8080);
console.log("node express app started at http://localhost:8080");