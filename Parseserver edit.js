var express = require('express');
var app = express();

app.get('/endpoint', function(request, response) {
    var id = request.query.id;
    response.end("I have received the ID: " + id);
    console.log(id);
});

app.listen(8080);
console.log("node express app started at http://localhost:8080");