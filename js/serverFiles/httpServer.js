"use strict";

//Imports
   var HTTP = require('http');
   var handler = require('./genericUrlHandle.js');

//Exports
   module.exports = {
      start: function(port){
         _start(port);
      }
   };

//Code
   //start(8080);

   // Provide a service to localhost only.
   function _start(port) {
      var service = HTTP.createServer(handler.handle);
      service.listen(port, 'localhost');
      console.log("Visit localhost:" + port);
   }
