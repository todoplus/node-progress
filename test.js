var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var Todo = require('./model/Todoschema.js');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var schema = new Schema({ name: String });
var Page = mongoose.model('Page', schema);
var p = new Page({ name: 'mongodb.org' });
console.log(p);
