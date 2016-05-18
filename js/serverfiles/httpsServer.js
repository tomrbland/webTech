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

   function _start(port) {
      var options = { key: KEY.key, cert: CERT.cert };
      var service = HTTP.createServer(options, HANDLER.handle);
      service.listen(port, 'localhost');
      console.log("Visit https://localhost:" + port);
   }
