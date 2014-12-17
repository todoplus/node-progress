var mongoose = require('mongoose');
var SSIDSchema = new mongoose.Schema({
    username: {type: String, default: ""},
    device: {type: String, default: ""},
    salter: {type: String, default: ""},
    ssid: {type: String, default: ""},
    created: {type: Date, default: Date.now}
});
module.exports = mongoose.model('SSID', SSIDSchema);
