   //Imports
   var ADD_REVIEW_ACTION_EVENT_HANDLER = require("events");
   var FS = require("fs");

   //Exports
   module.exports = {
      executeAction: function(response, url, db, userInput) {
         _executeAction(response, url, db, userInput);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   //If username matches a session ID then add
   //If failure along the way then status = 500 and the 2 other divs blank

   function _executeAction(response, url, db, userInput) {
      console.log("addReview.js - entered.");

      var eventEmitter = new ADD_REVIEW_ACTION_EVENT_HANDLER.EventEmitter();


      console.log(userInput.title);
      console.log(userInput.text);
      console.log(userInput.username);
      console.log(userInput.userSessionID);

      secondStageLoginVerification(db, userInput, eventEmitter);

      eventEmitter.on("Error", failureStatusReply.bind(null, response, url));
      eventEmitter.on("Valid login details", attemptAddReview.bind(null, db, userInput, eventEmitter));

      //eventEmitter.on("Success: Insert New Session ID - Finalized", successStatusReply.bind(null, response, url, userInput));
   }

   function secondStageLoginVerification(db, userInput, eventEmitter) {
      db.serialize(prepareSecondStageLoginVerification.bind(null, db, userInput, eventEmitter));
   }

   function prepareSecondStageLoginVerification(db, userInput, eventEmitter) {
      console.log("Second Stage Login Verification - Prepared statement");
      var ps = db.prepare("SELECT * FROM Logged_In WHERE sessionID = ? AND personID = (SELECT id FROM Person WHERE username = ?);", errorHandle.bind(null, "Second Stage Login Verification - Prepared statement", eventEmitter));
      eventEmitter.on("Success: Second Stage Login Verification - Prepared statement", getSecondStageLoginVerificationResults.bind(null, ps, userInput, eventEmitter));
   }

   function getSecondStageLoginVerificationResults(ps, userInput, eventEmitter) {
      console.log("Second Stage Login Verification - Get statement");
      ps.get(userInput.userSessionID, userInput.username, queryResult.bind(null, eventEmitter));
      ps.finalize(errorHandle.bind(null, "Second Stage Login Verification - Finalized", eventEmitter));
   }

   function queryResult(eventEmitter, error, row) {
      console.log("in queryResult");
      if (row) {
         console.log("SUCCESS: " + JSON.stringify(row));
         console.log("SUCCESS: row.personID - " + row.personID);
         eventEmitter.emit("Valid login details", row.personID);
      }
      else {
         console.log("ERROR: " + error);
         eventEmitter.emit("Error", error);
      }
   }

   function attemptAddReview(db, userInput, eventEmitter, personID) {
      console.log("attemptAddReview");
      console.log("personID: " + personID);
      db.serialize(prepareReviewInsertion.bind(null, db, userInput, personID, eventEmitter));
   }

   //personID title text
   function prepareReviewInsertion(db, userInput, personID, eventEmitter) {
      console.log("Add Review - Prepared statement");
      var ps = db.prepare("INSERT INTO Review (personID, title, text) VALUES (?, ?, ?);", errorHandle.bind(null, "Add Review - Prepared statement", eventEmitter));
      eventEmitter.on("Success: Add Review - Prepared statement", runReviewInsertion.bind(null, db, userInput, personID, eventEmitter));
   }

   function runReviewInsertion(db, userInput, personID, eventEmitter) {
      console.log("Add Review - Run statement");
      ps.run(personID, userInput.title, userInput.text, errorHandle.bind(ps, "Add Review - Run statement", eventEmitter));
      eventEmitter.on("Success: Add Review - Run statement", finalizeReviewInsertion.bind(null, ps, userInput, eventEmitter));
   }

   function finalizeReviewInsertion(ps, userInput, eventEmitter) {
      console.log("Add Review - Finalized");
      //console.log("Add Review - Finalized. insertedUserID: " + insertedUserID);
      ps.finalize(errorHandle.bind(null, "Add Review - Finalized", eventEmitter));
   }

   function errorHandle(message, eventEmitter, error) {
      console.log("\n************///------ Entered errorHandle for: " + message);
      if (error) {
         eventEmitter.emit("Error", error);
      }
      else {
         console.log("Success: ".concat(message));
         eventEmitter.emit("Success: ".concat(message));
      }
   }






   //-------------------------------- CREATE NEW SESSION ID --------------------------------

   function createUserSessionID(db, eventEmitter, insertedUserID) {
      console.log("\ncreateUserSessionID: ");
      console.log("createUserSessionID. insertedUserID: " + insertedUserID);

      CRYPTO.randomBytes(256, checkValidityOfCrytoRandomBytes.bind(null, "Crypto-secure session ID creation", eventEmitter));
      eventEmitter.on("Success: Crypto-secure session ID creation", attemptSessionIDInsertion.bind(null, db, eventEmitter, insertedUserID))
   }

   function checkValidityOfCrytoRandomBytes(message, eventEmitter, error, buffer) {
      if (error) {
         console.log("Error generating the crypto-secure random bytes.");
         eventEmitter.emit("Error");
      }
      else {
         console.log(buffer.length + "bytes of random data: " + buffer.toString("hex"));
         console.log("Success: ".concat(message));
         eventEmitter.emit("Success: ".concat(message), buffer.toString("hex"));
      }
   }

   function attemptSessionIDInsertion(db, eventEmitter, insertedUserID, sessionID) {
      db.serialize(prepareSessionIDInsertion.bind(null, db, eventEmitter, insertedUserID, sessionID));
   }

   function prepareSessionIDInsertion(db, eventEmitter, insertedUserID, sessionID) {
      console.log("Insert New Session ID - Prepared statement");
      var ps = db.prepare("INSERT INTO Logged_In (sessionID, personID) VALUES (?, ?);", errorHandle.bind(null, "Insert New Session ID - Prepared statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New Session ID - Prepared statement", runSessionIDInsertion.bind(null, ps, eventEmitter, insertedUserID, sessionID));
   }

   function runSessionIDInsertion(ps, eventEmitter, insertedUserID, sessionID) {
      console.log("Insert New Session ID - Run statement");
      ps.run(sessionID, insertedUserID, errorHandle.bind(null, "Insert New Session ID - Run statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New Session ID - Run statement", finalizeSessionIDInsertion.bind(null, ps, eventEmitter, sessionID));
   }

   function finalizeSessionIDInsertion(ps, eventEmitter, sessionID) {
      console.log("Insert New Session ID - Finalized");
      ps.finalize(errorHandle.bind(null, "Insert New Session ID - Finalized", eventEmitter, sessionID));
   }



   function failureStatusReply(response, url) {
      console.log("failureStatusReply");
      console.log(response + "\n");
      console.log(url + "\n");

      var file = "." + url;
      FS.readFile(file, failure.bind(null, response));
   }

   function failure(response, err, fileContent) {
      var typeHeader = { 'Content-Type': "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">500</div>');
      fileContent = fileContent.replace('<div class="hidden" id="userSessionID">$</div>', '<div class="hidden" id="userSessionID"></div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username"></div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }

   function successStatusReply(response, url, userInput, sessionID) {
      console.log("\nsuccessStatusReply: ");
      console.log("userInput: " + JSON.stringify(userInput));
      console.log("sessionID: " + sessionID);

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

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }
