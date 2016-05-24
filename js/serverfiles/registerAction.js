   //Imports
   var EVENTS_IN_REGISTER_ACTION = require("events");
   var FS = require("fs");

   //Exports
   module.exports = {
      executeAction: function(response, url, db, userInput) {
         _executeAction(response, url, db, userInput);
      }
   };

   //Private variables
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _executeAction(response, url, db, userInput) {
      console.log("registerAction.js - entered.");

      var eventEmitter = new EVENTS_IN_REGISTER_ACTION.EventEmitter();

      attemptUserRegistration(db, userInput, eventEmitter);

      eventEmitter.on("Success: Finalized", successStatusReply.bind(null, response, url, userInput, eventEmitter));
      eventEmitter.on("Error", failureStatusReply.bind(null, response, url, userInput));
   }

   function attemptUserRegistration(db, userInput, eventEmitter) {
      db.serialize(prepareNewUserInsertion.bind(null, db, userInput, eventEmitter));
   }

   function prepareNewUserInsertion(db, userInput, eventEmitter) {
      console.log("Prepared statement");
      var ps = db.prepare("INSERT INTO Person (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", errorHandle.bind(null, "Prepared statement", db, userInput, eventEmitter));
      eventEmitter.on("Success: Prepared statement", runStatement.bind(null, db, ps, userInput, eventEmitter));
   }

   function runStatement(db, ps, userInput, eventEmitter) {
      console.log("Run statement");
      ps.run(userInput.firstName, userInput.surname, userInput.username, userInput.email, userInput.password, errorHandle.bind(null, "Run statement", db, userInput, eventEmitter));
      console.log("ps.this: " + JSON.stringify(ps.this));
      eventEmitter.on("Success: Run statement", finalizeStatement.bind(null, db, ps, userInput, eventEmitter));
   }

   function finalizeStatement(db, ps, userInput, eventEmitter) {
      console.log("Finalized");
      ps.finalize(errorHandle.bind(null, "Finalized", db, userInput, eventEmitter));
   }

   function errorHandle(string, db, userInput, eventEmitter, error) {
      if (error) {
         eventEmitter.emit("Error", error);
      }
      else {
         eventEmitter.emit("Success: ".concat(string));
      }
   }

   function successStatusReply(response, url, userInput, eventEmitter) {
      /*
      console.log("successStatusReply: \n");
      console.log(response + "\n");
      console.log(url + "\n");
      console.log(JSON.stringify(userInput) + "\n");
      */

      const crypto = require('crypto');
      crypto.randomBytes(256, checkValidityOfCrytoRandomBytes.bind(null, eventEmitter));

      var file = "." + url;
      FS.readFile(file, success.bind(null, response, userInput));
   }

   function checkValidityOfCrytoRandomBytes(eventEmitter, error, buffer) {
   //   console.log("eventEmitter in crypto: " + JSON.stringify(eventEmitter));
   //   console.log("error in crypto: " + error);
   //   console.log("buffer in crypto: " + buffer);

      if (error) {
         console.log("Error generating the crypto-secure random bytes.");
         eventEmitter.emit("Error", error);
      }
      else {
         console.log(buffer.length + "bytes of random data: " + buffer.toString('hex'));
      }
   }

   function failureStatusReply(response, url, userInput) {
      console.log("failureStatusReply");
      console.log(response + "\n");
      console.log(url + "\n");
      console.log(JSON.stringify(userInput) + "\n");

      var file = "." + url;
      FS.readFile(file, failure.bind(null, response, userInput));
   }

   // Deliver the file that has been read in to the browser.
   function success(response, userInput, err, fileContent) {
      var typeHeader = { 'Content-Type': "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">200</div>');
      fileContent = fileContent.replace('<div class="hidden" id="uid">$</div>', '<div class="hidden" id="uid">1</div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username">' + userInput.username + '</div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }

   // Deliver the file that has been read in to the browser.
   function failure(response, userInput, err, fileContent) {
      var typeHeader = { 'Content-Type': "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">500</div>');
      fileContent = fileContent.replace('<div class="hidden" id="uid">$</div>', '<div class="hidden" id="uid"></div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username"></div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }
