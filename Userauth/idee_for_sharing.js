//Module laden
var mongoose = require('mongoose');

//DB-Connection aufbauen
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');

//sharewithvar
sharer = "Brotmann";

//username
var user = "Test";

//Userlade
var User = require('./model/Userschema2.js');

//getuser
User.find({username: user}, function (err, d) {
   console.log(d);
});

//User ergänze
User.find({username: user}, function (err, d) {
   d.add({ sharer: Boolean});
});

//getuser
User.find({username: user}, function (err, d) {
   console.log(d);
});