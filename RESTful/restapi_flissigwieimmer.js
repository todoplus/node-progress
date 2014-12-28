//Module laden
var express = require('express');
var crypto = require('crypto');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var us = require('underscore');
var rs = require('randomstring');

//app expressfunktionen zuweisen
var app = express();

//Status-Codes
var stat000 = "000 - Login ok";
var stat001 = "001 - Login failed";
var stat002 = "002 - Username already taken";
var stat003 = "003 - Removing ok";
var stat004 = "004 - No Todo with this ID found for you";
var stat005 = "005 - Shared User doesn't exist";

//body-parser Konfiguration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB-Connection aufbauen
mongoose.connect('mongodb://test:test@proximus.modulusmongo.net:27017/tap4eXub');

//MongoDB-Schemas importieren
var User = require('./model/Userschema2.js');
var Todo = require('./model/Todoschema2.js');
var SSID = require('./model/SessionSchema.js');

//User erstellen mit POST-Anfrage
app.post('/api/create', function(req, res) {
    var usr = req.body.usr;
    var device1 = req.body.device;
//SALT'er
    var salter1 = rs.generate();
    var thepass = crypto.createHash('sha512').update(req.body.pass+salter1).digest('hex');
    var number = User.count({username: usr}, function(err, c) {
       if (c < 1) {
          var b = new User({ username: usr, pass: thepass, salter: salter1});
          b.save();
          console.log("Added the user: " +b);
          console.log("");
          //generate SSID for this user
          var salter2 = rs.generate();
          var thepass2 = crypto.createHash('sha512').update(device1+salter2).digest('hex');
          var d = new SSID({username: usr, device: device1, salter: salter2, ssid: thepass2});
          d.save();
          res.json(Array({"user":usr, "ssid":d.ssid}));
	      res.end();
       }
       else {
          res.json(stat002);
          res.end();
          console.log("This username was requested and is already taken: " +usr);
          console.log(""); 
       }
    });
});


// login über POST-Anfrage
app.post('/api/login', function(req, res) {
   var usr = req.body.usr;
   var device1 = req.body.device;
   var thepass1 = req.body.pass;
//Abgleich mit Login-Daten und c gleich wieviele User mit dieser Kombination
   User.count({username:usr}, function(err, y) {  
      if (y == 1) { 
         User.findOne({username:usr}, function(err, e) {  
            var salter1 = e.salter;
            var thepass = crypto.createHash('sha512').update(thepass1+salter1).digest('hex');
            var number = User.count({username: usr, pass: thepass}, function(err, c) {
               console.log("Loginversuch für den Usernamen " +usr);
               if (c == 1) {
                  console.log(stat000);
                  console.log("");
                  SSID.count({username: usr, device: device1}, function (err, z) {
                     if (z == 1) {
                        SSID.findOne({username: usr, device: device1}, function (err, f) {
                           res.json(Array({"user":usr, "ssid":f.ssid}));
                           res.end();
                        });
                     }
                     else {
                        var salter2 = rs.generate();
                        var thepass2 = crypto.createHash('sha512').update(device1+salter2).digest('hex');
                        var g = new SSID({username: usr, salter: salter2, ssid: thepass2, device: device1});
                        g.save();
                        res.json(Array({"user":usr, "ssid":g.ssid}));
                        res.end();
                     }
                  });
               }

               else {
                  console.log(stat001);
                  console.log("");
                  res.json(stat001);
                  res.end();
               }
            });
        });
      }
      else {
         console.log(stat001);
         res.json(stat001);
         res.end();
      }

   });
});

//POST
app.post('/api', function(req, res) {
    var ssid = req.body.ssid;
    var text = req.body.text;
    var shared = req.body.shared;
    var number = SSID.count({ssid: ssid}, function(err, c) {
       if (c == 1) {
          SSID.findOne({ssid:ssid}, function(err, e) {  
             console.log("Der User " +e.username+ " hat POST angefordert");
             console.log(stat000);
//wird doch nonig erkennt ob alli shared user existiered -> isch das nötig? :(
//             User.count({username:shared}, function(err, f) {  
//                if (f == 1) {
                   var b = new Todo({name: text, user: e.username, sharedw: new RegExp(e.username+";", "i")});
                   b.save();
                   console.log("Added" + b);
                   console.log("");
                   res.json(Array(b));
                   res.end();   
//                }
//                else {
//                   res.json(stat005);
//                   res.end();
//                }   
//             });
          });  
       }
       
       else {
          console.log(stat001);
          res.json(stat001);
          res.end();
       }
    });
});


//put
app.put('/api/:Todo_id', function(req, res) {
//authent und text in body, id als param
    var ssid = req.body.ssid;
    var updatedtext = req.body.text;
//    var shared = req.body.shared;
    var id = req.params.Todo_id;
//login-überprüfung
    var number = SSID.count({ssid:ssid}, function(err, c) {
       if (c == 1) {
//update, wenn login erfolgreich
          SSID.findOne({ssid:ssid}, function(err, e) {  
             console.log(stat000);
             console.log("Der User" +e.username+ " hat PUT angefordert");
             Todo.count({ user: e.username, _id:id }, function (err, doc) {
             if (doc == 1) {
                Todo.findOne({ user: e.username, _id:id }, function (err, td) {
                   td.name = updatedtext;
                   td.save();
                   res.json(Array(td));
                   res.end();
                   console.log("Updated a Todo for the user " +e.username); 
                   console.log("");  
                });
             }
             else {
                var number2 = Todo.count({sharedw: new RegExp(e.username+";", "i"), _id: id}, function(err, f) {
                   if (f == 1) {
                      Todo.findOne({sharedw: new RegExp(e.username+";", "i"), _id:id }, function (err, j){
                         j.name = updatedtext;
                         j.save();
                         res.json(Array(j));
                         res.end();
                         console.log("Updated a shared Todo for the user " +e.username); 
                         console.log("");  
                      });
      
                   }
                   else {
                      console.log(stat004);
                      console.log("");
                      res.json(stat004);
                      res.end();
                   }

               });
             }
           });
        });
       }
       else {
          console.log(stat001);
          res.json(stat001);
          res.end();
       }
    });                         
});


//delete
app.delete('/api/:Todo_id/:User_ssid/', function(req, res) {
   var id = req.params.Todo_id;
   var ssid = req.params.User_ssid;
//login-überprüfung
    var number = SSID.count({ssid: ssid}, function(err, c) {
    if (c == 1) {
            SSID.findOne({ssid:ssid}, function(err, e) {  
            console.log(stat000);
            console.log("Der User" +e.username+ " hat PUT angefordert");
//check ob todo mit dere id vorhande für de user
            var number2 = Todo.count({user: e.username, _id: id}, function(err, d) {
                if (d == 1) {
                    Todo.remove({_id:id, user:e.username}, function(err) {
                        console.log(stat003);
                        console.log("");
                        res.json(stat003);
                        res.end();
                    });
                }
                else {
                    var number2 = Todo.count({sharedw: new RegExp(e.username+";", "i"), _id: id}, function(err, f) {
                        if (f == 1) {
                            Todo.remove({_id:id, sharedw: new RegExp(e.username+";", "i")}, function(err) {
                               console.log(stat003);
                               console.log("");
                               res.json(stat003);
                               res.end();
                             });            
                        }
                        else {
                            console.log(stat004);
                            console.log("");
                            res.json(stat004);
                            res.end();
                       }
                    });       
                }
            });
         });
       }                     
       else {
          console.log(stat001);
          res.json(stat001);
          res.end();
       }
    });
});


//get (nach usr)
app.get('/api', function(req, res) {
    var ssid = req.query.ssid;
    var number = SSID.count({ssid: ssid}, function(err, c) {
       if (c == 1) {
          SSID.findOne({ssid:ssid}, function(err, e) {  
             console.log(stat000);
             console.log("Der User "+e.username+" hat GET angefordert");
             Todo.find({user: e.username}, function (err, Todos) {
                console.log("Got all the Todos for the user " +e.username);
//"user;" muess Teil v. String si -> multisharing möglich
                Todo.find({sharedw: new RegExp(e.username+";", "i")}, function(err, Todos2) {
                   console.log("Got all the shared Todos for the user " +e.username);
                   res.json(us.extend(Todos,Todos2));
                   res.end();
                });
             });
          });   
       }
       else {
          console.log(stat001);
          res.json(stat001);
          res.end();
       }
    });
});


app.listen(process.env.PORT||8080);
console.log("Running on the Server and on Port 8080");
