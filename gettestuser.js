var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var Brot = require('./model/Brotschema.js');
var all = Brot.find({"user": "testuser"});
console.log(all);
