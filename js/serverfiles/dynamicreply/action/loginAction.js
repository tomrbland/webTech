   //Imports
   var LOGIN_ACTION_EVENT_HANDLING = require("events");
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
      var eventEmitter = new LOGIN_ACTION_EVENT_HANDLING.EventEmitter();

      attemptUserLogin(db, userInput, eventEmitter);

      eventEmitter.on("Error", failureStatusReply.bind(null, response, url));
      eventEmitter.on("Valid login details", createUserSessionID.bind(null, db, eventEmitter));
      eventEmitter.on("Success: Insert New Session ID - Finalized", successStatusReply.bind(null, response, url, userInput));
   }

   function attemptUserLogin(db, userInput, eventEmitter) {
      db.serialize(prepareLoginQuery.bind(null, db, userInput, eventEmitter));
   }

   function prepareLoginQuery(db, userInput, eventEmitter) {
      var ps = db.prepare("SELECT * FROM PERSON WHERE username = ? AND password = ?;", errorHandle.bind(null, "Login - Prepared statement", eventEmitter, null));
      eventEmitter.on("Success: Login - Prepared statement", getLoginQueryResults.bind(null, ps, userInput, eventEmitter));
   }

   function getLoginQueryResults(ps, userInput, eventEmitter) {
      ps.get(userInput.username, userInput.password, queryResult.bind(null, eventEmitter));
      ps.finalize(errorHandle.bind(null, "Login - Finalized", eventEmitter));
   }

   function queryResult(eventEmitter, error, row) {
      if (row) {
         eventEmitter.emit("Valid login details", row.id)
      }
      else {
         eventEmitter.emit("Error", error);
      }
   }

   //-------------------------------- CREATE NEW SESSION ID --------------------------------

   function createUserSessionID(db, eventEmitter, userID) {
      CRYPTO.randomBytes(256, checkValidityOfCrytoRandomBytes.bind(null, "Crypto-secure session ID creation", eventEmitter));
      eventEmitter.on("Success: Crypto-secure session ID creation", attemptSessionIDInsertion.bind(null, db, eventEmitter, userID))
   }

   function checkValidityOfCrytoRandomBytes(message, eventEmitter, error, buffer) {
      if (error) {
         eventEmitter.emit("Error");
      }
      else {
         eventEmitter.emit("Success: ".concat(message), buffer.toString("hex"));
      }
   }

   function attemptSessionIDInsertion(db, eventEmitter, userID, sessionID) {
      db.serialize(prepareSessionIDInsertion.bind(null, db, eventEmitter, userID, sessionID));
   }

   function prepareSessionIDInsertion(db, eventEmitter, userID, sessionID) {
      var ps = db.prepare("INSERT INTO Logged_In (sessionID, personID) VALUES (?, ?);", errorHandle.bind(null, "Insert New Session ID - Prepared statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New Session ID - Prepared statement", runSessionIDInsertion.bind(null, ps, eventEmitter, userID, sessionID));
   }

   function runSessionIDInsertion(ps, eventEmitter, userID, sessionID) {
      ps.run(sessionID, userID, errorHandle.bind(null, "Insert New Session ID - Run statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New Session ID - Run statement", finalizeSessionIDInsertion.bind(null, ps, eventEmitter, sessionID));
   }

   function finalizeSessionIDInsertion(ps, eventEmitter, sessionID) {
      ps.finalize(errorHandle.bind(null, "Insert New Session ID - Finalized", eventEmitter, sessionID));
   }

   function errorHandle(message, eventEmitter, sessionID, error) {
      if (error) {
         eventEmitter.emit("Error");
      }
      else {
         eventEmitter.emit("Success: ".concat(message), sessionID);
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
      fileContent = fileContent.replace('<div class="hidden" id="uid">$</div>', '<div class="hidden" id="uid"></div>');
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
