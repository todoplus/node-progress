var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var Todo = require('/Users/user1/Documents/new/model/Todoschema.js');
var all = Todo.find(function(err, Todo))
console.log(all);
