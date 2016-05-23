   "use strict";

   //Imports
   var EVENTS_IN_DYNAMIC_REPLY = require("events");
   var FS = require("fs");

   //Exports
   module.exports = {
      reviewsQueryThenReply: function(response, db){
         _reviewsQueryThenReply(response, db);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _reviewsQueryThenReply(response, db) {
      var eventEmitter = new EVENTS_IN_DYNAMIC_REPLY.EventEmitter();
      db.serialize(reviewsQuery.bind(null, response, db));

   //   eventEmitter.on("Error", failureReply.bind(null, response, url, userInput));
   //   eventEmitter.on("Success", failureReply.bind(null, response, url, userInput));
   }

   function reviewsQuery(response, db) {
      var ps = db.prepare("SELECT username, title, text FROM Review JOIN Person ON Review.personid = Person.id;", errorHandle.bind(null, "Prepared statement", userInput, db, eventEmitter));
      eventEmitter.on("Success: Prepared statement", getAllResults.bind(null, userInput, db, ps, eventEmitter));
   }

   function getAllResults() {
      ps.all(setReply.bind(null, response));
      ps.finalize();
   }



   function errorHandle(string, userInput, db, eventEmitter, error) {
   //   console.log("outside conditional, error: " + JSON.stringify(error));
   //   console.log("outside conditional, string: " + JSON.stringify(string));
   //   console.log("outside conditional, userInput: " + JSON.stringify(userInput));
   //   console.log("outside conditional, db: " + JSON.stringify(db));

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

   function setReply(response, error, rows) {
      if (error) {
         console.log("setReply() - error");

         console.log("Error: " + error);
         successReply(response, rows);
      //   eventEmitter.emit("Error");
      }
      else {
         console.log("setReply() - success");

         //eventEmitter.emit("Success");
         successReply(response, rows);
      }
   }

   function failureReply() {
      console.log("failureReply()");

      var file = "." + url;
      FS.readFile(file, deliver.bind(null, response, type));
   }

   function successReply(response, rows) {
      console.log("successReply()");
      console.log("reply - Rows after being stringified: " + JSON.stringify(rows));
      console.log("reply - Rows after being parsed: " );

      for (var i = 0; i < Object.keys(rows).length; i++) {
         console.log("reply - Row " + i + ": " + rows[i].username + ": " + rows[i].title + ": " + rows[i].text);
      }

      var file = "." + url;
      FS.readFile(file, success.bind(null, response, rows));
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
   function deliver(response, type, err, fileContent) {
      if (err) return _fail(response, NotFound, "File not found");
      var typeHeader = { 'Content-Type': type };
      response.writeHead(OK, typeHeader);
      response.write(fileContent);
      response.end();
   }

   // Give a minimal failure response to the browser
   function _fail(response, code, text) {
      var textTypeHeader = { 'Content-Type': 'text/plain' };
      response.writeHead(code, textTypeHeader);
      response.write(text, 'utf8');
      response.end();
   }
