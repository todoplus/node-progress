//Module laden
var mongoose = require('mongoose');

//DB-Connection aufbauen
mongoose.connect('mongodb://Todoplus:7sijab3a3@proximus.modulusmongo.net:27017/hI2dyxej');

//MongoDB-Schemas importieren
var User = require('./model/Userschema2.js');
var Todo = require('./model/Todoschema2.js');
var SSID = require('./model/Sessionschema.js');

User.remove({}, function(err) { 
   console.log('User-collection removed') 
});

Todo.remove({}, function(err) { 
   console.log('Todo-collection removed') 
});

SSID.remove({}, function(err) { 
   console.log('SSID-collection removed') 
});
