

   var request = require("request");

   request("http://api.dronestre.am/data", function(error, response, body) {
     console.log(body);
     var fs = require('fs');
     fs.writeFile("drones.json", body, function(err) {
        if(err) {
           return console.log(err);
        }
     console.log("The file was saved!"); });
   });
