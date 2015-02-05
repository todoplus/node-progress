var http = require('http');

var count = 0;

var options = {
    host: 'new-todoplus.c9.io',
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
};

console.log("Start");
function ping() {
    count = count+1;
    var g = http.request(options,function(res){
        console.log("Connected");
        res.on('data',function(data){
            console.log("Got the data for the " +count+". time");
        });
    });
    g.end();
}
setInterval(ping, 14400*1000);