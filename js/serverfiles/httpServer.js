"use strict";
/**
 *   HTTP server based on Ian's server4
 */

//Imports
   var HTTP = require("http");
   var REDIRECTOR = require("./redirector.js");

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
      var service = HTTP.createServer(REDIRECTOR.redirect);
      service.listen(port, "localhost");
      console.log("Visit http://localhost:" + port);
   }
