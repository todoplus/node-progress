var http = require('http');
var mongoose = require('mongoose');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var Todo = require('./model/Todoschema.js');
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');
var app = express();
