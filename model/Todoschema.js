var mongoose = require('mongoose');
var TodoSchema = new mongoose.Schema({
    name: String,
    type: String
});
module.exports = mongoose.model('Todo', TodoSchema);
