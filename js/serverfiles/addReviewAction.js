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

   function _executeAction(response, url, db, userInput) {
      console.log("addReview.js - entered.");

      var eventEmitter = new ADD_REVIEW_ACTION_EVENT_HANDLER.EventEmitter();

      secondStageLoginVerification(db, userInput, eventEmitter);

      eventEmitter.on("Error", failureStatusReply.bind(null, response, url));
      eventEmitter.on("Valid login details", attemptAddReview.bind(null, db, userInput, eventEmitter));
      eventEmitter.on("Success: Add Review - Finalized", successStatusReply.bind(null, response, url, userInput));
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

   function prepareReviewInsertion(db, userInput, personID, eventEmitter) {
      console.log("Add Review - Prepared statement");
      var ps = db.prepare("INSERT INTO Review (personID, title, text) VALUES (?, ?, ?);", errorHandle.bind(null, "Add Review - Prepared statement", eventEmitter));
      eventEmitter.on("Success: Add Review - Prepared statement", runReviewInsertion.bind(null, ps, userInput, personID, eventEmitter));
   }

   function runReviewInsertion(ps, userInput, personID, eventEmitter) {
      console.log("personID: " + personID);
      console.log("userInput.title: " + userInput.title);
      console.log("userInput.text: " + userInput.text);

      console.log("Add Review - Run statement");
      ps.run(personID, userInput.title, userInput.text, errorHandle.bind(null, "Add Review - Run statement", eventEmitter));
      eventEmitter.on("Success: Add Review - Run statement", finalizeReviewInsertion.bind(null, ps, userInput, eventEmitter));
   }

   function finalizeReviewInsertion(ps, userInput, eventEmitter) {
      console.log("Add Review - Finalized");
      ps.finalize(errorHandle.bind(null, "Add Review - Finalized", eventEmitter));
   }

   function errorHandle(message, eventEmitter, error) {
      console.log("\n************///------ Entered errorHandle for: " + message);
      if (error) {
         console.log("ERROR: " + error);
         eventEmitter.emit("Error", error);
      }
      else {
      //   console.log("this.lastID: " + this.lastID);
         console.log("Success: ".concat(message));
         eventEmitter.emit("Success: ".concat(message));
      }
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

   function successStatusReply(response, url, userInput) {
      console.log("\nsuccessStatusReply: ");
      console.log("userInput: " + JSON.stringify(userInput));

      var file = "." + url;
      FS.readFile(file, success.bind(null, response, userInput));
   }

   function success(response, userInput, err, fileContent) {
      var typeHeader = { "Content-Type": "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">200</div>');
      fileContent = fileContent.replace('<div class="hidden" id="userSessionID">$</div>', '<div class="hidden" id="userSessionID">' + userInput.userSessionID + '</div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username">' + userInput.username + '</div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }
