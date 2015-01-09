var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username: {type: String, default: ""},
    salter: {type: String, default: ""},
    pass: {type: String, default: ""},
    white: {type: String, default: ""},
    joined: {type: Date, default: Date.now}
});
module.exports = mongoose.model('User', UserSchema);
