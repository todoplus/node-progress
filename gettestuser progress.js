var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var Brot = require('./model/Brotschema.js');
var k = Brot.find({}).exec(function(err, result) {
  	if (!err) {
    		// handle result
  	} else {
    		// error handling
  	};
});
console.log(k);
console.log("b");
