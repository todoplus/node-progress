var mongoose = require('mongoose');
var TodoSchema = new mongoose.Schema({
    name: {type: String, default: ""},
    user: {type: String, default: ""},
    sharedw: {type: String, default: ""},
    Date: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Todo', TodoSchema);
