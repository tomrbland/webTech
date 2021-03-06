   //Imports
   var REGISTER_ACTION_EVENT_HANDLER = require("events");
   var FS = require("fs");
   var CRYPTO = require("crypto");


   //Exports
   module.exports = {
      executeAction: function(response, url, db, userInput) {
         _executeAction(response, url, db, userInput);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _executeAction(response, url, db, userInput) {
      var eventEmitter = new REGISTER_ACTION_EVENT_HANDLER.EventEmitter();

      attemptUserRegistration(db, userInput, eventEmitter);

      eventEmitter.on("Error", failureStatusReply.bind(null, response, url));
      eventEmitter.on("Success: Insert New User - Finalized", createUserSessionID.bind(null, db, eventEmitter));
      eventEmitter.on("Success: Insert New Session ID - Finalized", successStatusReply.bind(null, response, url, userInput));
   }

   function attemptUserRegistration(db, userInput, eventEmitter) {
      db.serialize(prepareNewUserInsertion.bind(null, db, userInput, eventEmitter));
   }

   function prepareNewUserInsertion(db, userInput, eventEmitter) {
      var ps = db.prepare("INSERT INTO Person (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", errorHandle.bind(null, "Insert New User - Prepared statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New User - Prepared statement", runNewUserInsertion.bind(null, db, ps, userInput, eventEmitter));
   }

   function runNewUserInsertion(db, ps, userInput, eventEmitter) {
      ps.run(userInput.firstName, userInput.surname, userInput.username, userInput.email, userInput.password, errorHandle.bind(ps, "Insert New User - Run statement", eventEmitter, userInput));
      eventEmitter.on("Success: Insert New User - Run statement", finalizeNewUserInsertion.bind(null, db, ps, userInput, eventEmitter));
   }

   function finalizeNewUserInsertion(db, ps, userInput, eventEmitter, insertedUserID) {
      ps.finalize(errorHandle.bind(null, "Insert New User - Finalized", eventEmitter, insertedUserID));
   }

   //-------------------------------- CREATE NEW SESSION ID --------------------------------

   function createUserSessionID(db, eventEmitter, insertedUserID) {
      CRYPTO.randomBytes(256, checkValidityOfCrytoRandomBytes.bind(null, "Crypto-secure session ID creation", eventEmitter));
      eventEmitter.on("Success: Crypto-secure session ID creation", attemptSessionIDInsertion.bind(null, db, eventEmitter, insertedUserID))
   }

   function checkValidityOfCrytoRandomBytes(message, eventEmitter, error, buffer) {
      if (error) {
         eventEmitter.emit("Error");
      }
      else {
         eventEmitter.emit("Success: ".concat(message), buffer.toString("hex"));
      }
   }

   function attemptSessionIDInsertion(db, eventEmitter, insertedUserID, sessionID) {
      db.serialize(prepareSessionIDInsertion.bind(null, db, eventEmitter, insertedUserID, sessionID));
   }

   function prepareSessionIDInsertion(db, eventEmitter, insertedUserID, sessionID) {
      var ps = db.prepare("INSERT INTO Logged_In (sessionID, personID) VALUES (?, ?);", errorHandle.bind(null, "Insert New Session ID - Prepared statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New Session ID - Prepared statement", runSessionIDInsertion.bind(null, ps, eventEmitter, insertedUserID, sessionID));
   }

   function runSessionIDInsertion(ps, eventEmitter, insertedUserID, sessionID) {
      ps.run(sessionID, insertedUserID, errorHandle.bind(null, "Insert New Session ID - Run statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New Session ID - Run statement", finalizeSessionIDInsertion.bind(null, ps, eventEmitter, sessionID));
   }

   function finalizeSessionIDInsertion(ps, eventEmitter, sessionID) {
      ps.finalize(errorHandle.bind(null, "Insert New Session ID - Finalized", eventEmitter, sessionID));
   }

   function errorHandle(message, eventEmitter, id, error) {
      if (error) {
         eventEmitter.emit("Error", error);
      }
      else {
         if (message === "Insert New User - Run statement") {
            eventEmitter.emit("Success: ".concat(message), this.lastID);
         }
         //Used for "Insert New User - Finalized" to return the DB id of the inserted person
         //Used for "Insert New Session ID - Finalized" to return the DB id of the new session
         else if (message.includes("Finalized")) {
            eventEmitter.emit("Success: ".concat(message), id);
         }
         else {
            eventEmitter.emit("Success: ".concat(message));
         }
      }
   }

   function failureStatusReply(response, url) {
      var file = "." + url;
      FS.readFile(file, failure.bind(null, response));
   }

   function failure(response, err, fileContent) {
      var typeHeader = { "Content-Type": "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">500</div>');
      fileContent = fileContent.replace('<div class="hidden" id="userSessionID">$</div>', '<div class="hidden" id="userSessionID"></div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username"></div>');

      response.write(fileContent);
      response.end();
   }

   function successStatusReply(response, url, userInput, sessionID) {
      var file = "." + url;
      FS.readFile(file, success.bind(null, response, userInput, sessionID));
   }

   function success(response, userInput, sessionID, err, fileContent) {
      var typeHeader = { "Content-Type": "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">200</div>');
      fileContent = fileContent.replace('<div class="hidden" id="userSessionID">$</div>', '<div class="hidden" id="userSessionID">' + sessionID + '</div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username">' + userInput.username + '</div>');

      response.write(fileContent);
      response.end();
   }
