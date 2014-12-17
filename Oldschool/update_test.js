var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var Brot = require('./model/Brotschema.js');

//put (m usr und text)
app.get('/put', function(request, response) {
    var usr = request.query.usr;
    var text = request.query.text;
    var b = new Brot({ name: text, user: usr});
    b.save();
    console.log("Added " +b);
    response.end("I have added the following: " +b);
});

//get (nach usr)
app.get('/get', function(request, response) {
    var usr = request.query.usr;
    Brot.find({user: usr}, function (err, Brots) {
       console.log("Got all the Todos for the user " +usr);
       response.json(Brots);
    });
});

//delete (nach id)
app.get('/rmv', function(request, response) {
    var id = request.query.id;
    Brot.remove({_id:id}, function(err){
       if(err) throw err;
       console.log("Removed the Todo with the id " + id);
       response.end("Removed the Todo with the id " + id);
    });
});

//update (nach id)
app.get('/update', function(request, response) {
    var usr = request.query.usr;
    var text = request.query.text;
    var toupdate = request.query.update;
    Brot.findOne({ user: usr, name: text }, function (err, doc){
       doc.name = toupdate;
       doc.save();
       response.json(doc);
       console.log(doc);
});
});

app.listen(8080);
console.log("node express app started at http://localhost:8080");