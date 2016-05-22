   //Imports
   var EVENTS = require("events");
   var SQL = require("sqlite3");

   //Exports
   module.exports = {
      executeAction: function(response, url, userInput) {
         _executeAction(response, url, userInput);
      }
   };

   //"./js/db/resortReport.db"

   //Private variables
   var eventEmitter = new EVENTS.EventEmitter();
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;
   var ps;

   function _executeAction(response, url, userInput) {
      console.log("registerAction.js - entered.");

      attemptUserRegistration(userInput);

      eventEmitter.on("Success: DB closed", successStatusReply.bind(null, response, url, userInput));
      eventEmitter.on("Error", failureStatusReply.bind(null, response, url, userInput));
   }

   function attemptUserRegistration(userInput) {
      SQL.verbose();
      var db = new SQL.Database("./js/db/resortReport.db");
      //By default, statements run in parallel. If I only serialize the ps is this even doing anything?
      db.serialize(prepareNewUserInsertion.bind(null, userInput, db));
   }

   function prepareNewUserInsertion(userInput, db) {
      console.log("Prepared statement");
      ps = db.prepare("INSERT INTO Person (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", errorHandle.bind(null, "Prepared statement", userInput, db));
      eventEmitter.on("Success: Prepared statement", runStatement.bind(null, userInput, db));
   }

   function runStatement(userInput, db) {
      console.log("Run statement");
      ps.run(userInput.firstName, userInput.surname, userInput.username, userInput.email, userInput.password, errorHandle.bind(null, "Run statement", userInput, db));
      eventEmitter.on("Success: Run statement", finalizeStatement.bind(null, userInput, db));
   }

   function finalizeStatement(userInput, db) {
      console.log("Finalize");
      ps.finalize(errorHandle.bind(null, "Finalize", userInput, db));
      eventEmitter.on("Success: Finalize", closeDB.bind(null, userInput, db));
   }

   function closeDB(userInput, db) {
      console.log("DB closed");
      db.close(errorHandle.bind(null, "DB closed", userInput, db));
   }

   function errorHandle(string, userInput, db, error) {
      console.log("outside conditional, error: " + JSON.stringify(error));
      console.log("outside conditional, string: " + JSON.stringify(string));
      console.log("outside conditional, userInput: " + JSON.stringify(userInput));
      console.log("outside conditional, db: " + JSON.stringify(db));

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

         eventEmitter.emit("Success: ".concat(string), userInput);
   //      console.log("String in errorHandle for else: " + string);
      }
   }

   function successStatusReply(response, url, userInput) {
      console.log("successStatusReply: \n");
      console.log(response + "\n");
      console.log(url + "\n");
      console.log(JSON.stringify(userInput) + "\n");

      var file = "." + url;
      //Needed to do this to avoid Error: write after end
      var FS = require("fs");
      FS.readFile(file, success.bind(null, response, userInput));
   }

   function failureStatusReply(response, url, userInput) {
      console.log("failureStatusReply");
      console.log(response + "\n");
      console.log(url + "\n");
      console.log(JSON.stringify(userInput) + "\n");

      var file = "." + url;
      //Needed to do this to avoid Error: write after end
      var FS = require("fs");
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
      fileContent = fileContent.replace('<div class="hidden" id="uid">$</div>', '<div class="hidden" id="uid">1</div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username">' + userInput.username + '</div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }
