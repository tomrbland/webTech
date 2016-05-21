"use strict";
/**
 * cert and key generated with "openssl req -x509 -sha512 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365"
 */

//Imports
   var HTTP = require("https");
   var URL_VALIDATION = require("./urlValidation.js");
   var FS = require("fs");

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
          key: FS.readFileSync("./js/serverfiles/key.pem"),
          cert: FS.readFileSync("./js/serverfiles/cert.pem"),
          passphrase: "verysecurepassword"
      }

      var service = HTTP.createServer(credentials, URL_VALIDATION.validate);
      service.listen(port, "localhost");
      console.log("Visit https://localhost:" + port);
   }
