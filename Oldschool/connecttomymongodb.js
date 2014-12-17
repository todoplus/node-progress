var mongoose = require('mongoose');
var express = require('express'); //tff
var bodyParser = require('body-parser'); //trashforfuture
var Todo = require('./model/Todoschema.js'); //model
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
