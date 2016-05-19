"use strict";
/**
 * cert and key generated with "openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365"
 */

//Imports
   var HTTP = require('https');
   var HANDLER = require('./handle.js');
   var FS = require('fs');

//Exports
   module.exports = {
      start: function(port){
         _start(port);
      }
   };

//Code
   //start(8443);

   function _start(port) {
      var credentials = {
          key: FS.readFileSync('./js/serverfiles/key.pem'),
          cert: FS.readFileSync('./js/serverfiles/cert.pem'),
          passphrase: 'knickers'
      }

      var service = HTTP.createServer(credentials, HANDLER.handle);
      service.listen(port, 'localhost');
      console.log("Visit https://localhost:" + port);
   }
