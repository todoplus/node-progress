var mongoose = require('mongoose');
var List = require('/Users/user1/Documents/new/model/ListSchema.js');
var c = new List({content: "Todo", priority: "lol", date: "16.10.14", device: "MBookPro", account: "Testaccount"});
c.save()
console.log(c)
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
