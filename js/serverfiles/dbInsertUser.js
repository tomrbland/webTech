   //Imports
   var SQL = require("sqlite3");
   var EVENTS = require('events');

   //Exports
   module.exports = {
      insertUser: function(userInput){
         _insertUser(userInput);
      }
   };

   var obj = new Object();
   obj.firstName = "test";
   obj.surname = "me";
   obj.username = "mea22211sss1sk111k1eee111232dd1112a";
   obj.email = "m22sseddd111111kddd1111kk112ffa@ass.com";
   obj.password = "12312";

   //Private variables
   var eventEmitter = new EVENTS.EventEmitter();
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   _executeAction("response", "url", obj);

   function _executeAction(response, url, userInput) {
      console.log("registerAction.js - entered.");

      attemptUserRegistration(userInput);

      eventEmitter.on("Success: DB closed", successStatusReply.bind(null, response, url, userInput));
      eventEmitter.on("Error", failureStatusReply.bind(null, response, url, userInput));
   }

   function attemptUserRegistration(userInput) {
      SQL.verbose();
      var db = new SQL.Database("../db/resortReport.db");
      //By default, statements run in parallel. If I only serialize the ps is this even doing anything?
      db.serialize(prepareNewUserInsertion.bind(null, userInput, db));
   }

   function prepareNewUserInsertion(userInput, db) {
      console.log("Prepared statement");
      var ps = db.prepare("INSERT INTO Person (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", errorHandle.bind(null, "Prepared statement", userInput, db));
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
   //   var file = "." + url;
   //   FS.readFile(file, success.bind(null, response, userInput));
   }

   function failureStatusReply(response, url, userInput) {
      console.log("failureStatusReply");
      console.log(response + "\n");
      console.log(url + "\n");
      console.log(JSON.stringify(userInput) + "\n");

   //   var file = "." + url;
   //   FS.readFile(file, failure.bind(null, response, userInput));
   }
