var url = require('url');
var query = require('url').parse(req.url,true).query;
var user=query.test;
var text=query.text;
