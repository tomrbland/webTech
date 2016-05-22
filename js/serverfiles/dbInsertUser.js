   //Imports
   var SQL = require("sqlite3");
   var events = require('events');

   //Exports
   module.exports = {
      insertUser: function(userInput){
         _insertUser(userInput);
      }
   };



   var obj = new Object();
   obj.firstName = "test";
   obj.surname = "me";
   obj.username = "mea";
   obj.email = "mea@as.com";
   obj.password = "12312";

   console.log(JSON.stringify(obj));

   var eventEmitter = new events.EventEmitter();
   insertUser(obj);

   function insertUser(userInput) {
      console.log("initial userInput: " + userInput);
      _executeAction("Response", "URL", userInput);
   }

   function _executeAction(response, url, userInput) {
      console.log("_executeAction.js - entered.");
      console.log("exe ui: " + userInput);

      attemptUserRegistration(userInput);

      eventEmitter.on("Error", failureStatusReply.bind(null, response, url, userInput));
      eventEmitter.on("Success: Prepared statement", runStatement.bind(null, userInput));
      eventEmitter.on("Success: Run statement", finalizeStatement);
      eventEmitter.on("Success: Finalize", closeDB);
      eventEmitter.on("Success: DB closed", successStatusReply.bind(null, response, url, userInput));
   }

   function errorEvent(error) {
      console.log("ERROR EVENT: ");
      console.log(error);
   }

   function attemptUserRegistration(userInput) {
      SQL.verbose();
      var db = new SQL.Database("../db/resortReport.db");
      //By default, statements run in parallel. If I only serialize the ps is this even doing anything?
      db.serialize(prepareNewUserInsertion.bind(null, db, userInput));
   }

   function prepareNewUserInsertion(db, userInput) {
      console.log("prepare ui: " + userInput);
      console.log("Prepared statement");
      var ps = db.prepare("INSERT INTO Person (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", errorHandle.bind(null, "Prepared statement"));
   }

   function runStatement(userInput) {
      console.log("Run statement");
      console.log("run ui: " + userInput);
      ps.run(userInput.firstName, userInput.surname, userInput.username, userInput.email, userInput.password, errorHandle.bind(null, "Run statement"));
   }

   function finalizeStatement(db, userInput) {
      console.log("Finalize");
      ps.finalize(errorHandle.bind(null, "Finalize"));
   }

   function closeDB(db, userInput) {
      db.close(errorHandle.bind(null, "DB closed"));
   }

   function errorHandle(string, error) {
   //   console.log("outside conditional, error: " + error);
   //   console.log("outside conditional, string: " + string);
      if (error) {
      //   console.log(error);
      //   console.log("inside conditional ERROR, error " + error);
      //   console.log("inside conditional ERROR, string " + string);

         eventEmitter.emit("Error", error);
      //   console.log("String in errorHandle for error: " + string);
      }
      else {
      //   console.log("inside conditional no error, error " + error);
      //   console.log("inside conditional no error, string " + string);

         eventEmitter.emit("Success: ".concat(string));
   //      console.log("String in errorHandle for else: " + string);
      }
   }

   function successStatusReply(response, url, userInput) {
      console.log(response);
      console.log(url);
      console.log(userInput);
   }

   function failureStatusReply(response, url, userInput) {
      console.log("failure Status");
   }
