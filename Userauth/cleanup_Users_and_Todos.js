//Module laden
var mongoose = require('mongoose');

//DB-Connection aufbauen
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');

//MongoDB-Schemas importieren
var User = require('./model/Userschema2.js');
var Todo = require('./model/Todoschema2.js');

User.remove({}, function(err) { 
   console.log('User-collection removed') 
});

Todo.remove({}, function(err) { 
   console.log('Todo-collection removed') 
});
