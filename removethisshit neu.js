var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var Todo = require('/Users/user1/Documents/new/model/Todoschemaneu.js');
Todo.findOne(function(err, Todo){
Todo.remove()
})
