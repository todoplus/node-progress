var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var Set = require('/Users/user1/Documents/new/model/Todoschema.js');
var b = new Set({ name: "gghlhkjhkhkjg" }); // effektivs Todo
b.save();
console.log(b);
