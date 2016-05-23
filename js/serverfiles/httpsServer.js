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
      },

      service: function(){
         _service();
      },

      shutDown: function(){
         _shutDown(service, myCallback);
      }
   };

   /*
   //Exports
   module.exports = {
      reply: function(response, url, type){
         _reply(response, url, type);
      },

      fail: function(response, code, text){
         _fail(response, code, text);
      }
   };
   */

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

      function _service() {
         return service;
      }
   }

   HTTPS_SERVER.shutdown(HTTPS_SERVER.service(), db.close())


   function _shutDown(service, funct) {
      funct();
      console.log("\nServer connection closed.");
      service.close(function exitProcess() {
         process.exit();
      });
   }

   //Listens for the kill command
   process.on("SIGTERM", _shutDown);

   //Listens for the Ctrl-C command
   process.on("SIGINT", _shutDown);
/*
   function shutDown() {
      //close db
      console.log("\nServer connection closed.");
      service.close(function exitProcess() {
         process.exit();
      });
   } */

// WHY ISNT THIS WORKING
// !!!!
/*
   service.on('close', function() {
     console.log(' Stopping ...');
  });

   process.on('SIGINT', function() {
      process.exit(2);
      service.close();
  });

  process.on('exit', function () {
   // process.emit('cleanup');
   console.log("hi");
}); */
