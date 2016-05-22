   //Imports
   var EVENTS = require("events");
   var SQL = require("sqlite3");
   var FS = require("fs");

   //Exports
   module.exports = {
      executeAction: function(response, url, userInput) {
         _executeAction(response, url, userInput);
      }
   };

   //Private variables
   var db, ps;
   var eventEmitter = new EVENTS.EventEmitter();
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _executeAction(response, url, userInput) {
      console.log("registerAction.js - entered.");

      attemptUserRegistration(userInput);

      eventEmitter.on("Success: Prepared statement", runStatement.bind(null, userInput));
      eventEmitter.on("Success: Run statement", finalizeStatement);
      eventEmitter.on("Success: Finalize", closeDB);
      eventEmitter.on("Success: DB closed", successStatusReply.bind(null, response, url, userInput));
      eventEmitter.on("Error", failureStatusReply.bind(null, response, url, userInput));
   }

   function attemptUserRegistration(userInput) {
      SQL.verbose();
      db = new SQL.Database("../db/resortReport.db");
      //By default, statements run in parallel. If I only serialize the ps is this even doing anything?
      db.serialize(prepareNewUserInsertion.bind(null, db, userInput));
   }

   function prepareNewUserInsertion(db, userInput) {
      console.log("Prepared statement");
      ps = db.prepare("INSERT INTO Person (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", errorHandle.bind(null, "Prepared statement"));
   }

   function runStatement(userInput) {
      console.log("Run statement");
      ps.run(userInput.firstName, userInput.surname, userInput.username, userInput.email, userInput.password, errorHandle.bind(null, "Run statement"));
   }

   function finalizeStatement(db, userInput) {
      console.log("Finalize");
      ps.finalize(errorHandle.bind(null, "Finalize"));
   }

   function closeDB(db, userInput) {
      console.log("DB closed");
      db.close(errorHandle.bind(null, "DB closed"));
   }

   function errorHandle(string, error) {
   //   console.log("outside conditional, error: " + error);
   //   console.log("outside conditional, string: " + string);
      if (error) {
         console.log(string + " : " + error);
      //   console.log("inside conditional ERROR, error " + error);
      //   console.log("inside conditional ERROR, string " + string);

         eventEmitter.emit("Error", error);
      //   console.log("String in errorHandle for error: " + string);
      }
      else {

         console.log(string + " : " + "success");
      //   console.log("inside conditional no error, error " + error);
      //   console.log("inside conditional no error, string " + string);

         eventEmitter.emit("Success: ".concat(string));
   //      console.log("String in errorHandle for else: " + string);
      }
   }

   function errorEvent(error) {
      console.log("ERROR EVENT: ");
      console.log(error);
   }

   function successStatusReply(response, url, userInput) {
      console.log("successStatusReply");
   //   console.log(response);
   //   console.log(url);
   //   console.log(userInput);
      var file = "." + url;
      FS.readFile(file, success.bind(null, response, userInput));
   }

   function failureStatusReply(response, url, userInput) {
      console.log("failureStatusReply");

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
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">FAILURE</div>');
      fileContent = fileContent.replace('<div class="hidden" id="uid">$</div>', '<div class="hidden" id="uid">1</div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username">' + userInput.username + '</div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }
