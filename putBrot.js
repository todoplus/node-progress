var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var Brot = require('./model/Brotschema.js');
var b = new Brot({ name: "testaggaas", user: "testuser2"}); // effektivs Todo, user
b.save();
console.log(b);
