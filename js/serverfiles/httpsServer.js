"use strict";
/**
 * cert and key generated with "openssl req -x509 -sha512 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365"
 */

//Imports
   var FS = require("fs");
   var SQL = require("sqlite3");
   var HTTP = require("https");
   var URL_VALIDATION = require("./urlValidation.js");

//Exports
   module.exports = {
      start: function(port){
         _start(port);
      },

      service: function(){
          _start.service();
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

      SQL.verbose();
      var db = new SQL.Database("./js/serverfiles/db/resortReport.db");

      var service = HTTP.createServer(credentials, URL_VALIDATION.validate.bind(null, db));

      service.listen(port, "localhost");
      console.log("Visit https://localhost:" + port);

      //Listens for the kill command
      process.on("SIGTERM", shutDown);
      //Listens for the Ctrl-C command
      process.on("SIGINT", shutDown);

      function shutDown() {
         db.close();
         console.log("\nDatabase connection closed.");
         console.log("Server connection closed.");
         process.exit();
      }
   }
