var mongoose = require('mongoose');
var BrotSchema = new mongoose.Schema({
    name: {type: String, default: ""},
    user: {type: String, default: ""},
    Date: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Brot', BrotSchema);
