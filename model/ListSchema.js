var mongoose = require('mongoose');
var ListSchema = new mongoose.Schema({
content: String,
priority: String,
date: String,
device: String,
account: String
});
module.exports = mongoose.model('List', ListSchema);
