"use strict";
/**
 *   HTTP server based on Ian's server4
 */

//Imports
   var HTTP = require('https');
   var HANDLER = require('./handle.js');
   var CERT = require('./cert');
   var KEY = require('./key');

//Exports
   module.exports = {
      start: function(port){
         _start(port);
      }
   };

//Code
   //start(8443);

   // Provide a service to localhost only.
   function _start(port) {
      var options = { key: KEY, cert: CERT };
      var service = HTTP.createServer(options, HANDLER.handle);
      service.listen(port, 'localhost');
      console.log("Visit https://localhost:" + port);
   }
