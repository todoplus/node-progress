var mongoose = require('mongoose');
var GroupSchema = new mongoose.Schema({
    owner: {type: String, default: ""},
    groupname: {type: String, default: ""},
    members: {type: String, default: ""},
    created: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Group', GroupSchema);
