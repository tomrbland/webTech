   "use strict";

   //Imports
   var EVENTS_IN_DYNAMIC_REPLY = require("events");
   var FS = require("fs");

   //Exports
   module.exports = {
      reviewsQueryThenReply: function(response, url, db){
         _reviewsQueryThenReply(response, url, db);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _reviewsQueryThenReply(response, url, db) {
      var eventEmitter = new EVENTS_IN_DYNAMIC_REPLY.EventEmitter();
      db.serialize(reviewsQuery.bind(null, response, url, db, eventEmitter));

      eventEmitter.on("Error", failureReply.bind(null, response, url));
   //   eventEmitter.on("Success", failureReply.bind(null, response, url, userInput));
   }

   function reviewsQuery(response, url, db, eventEmitter) {
      var ps = db.prepare("SELECT firstName, surname, title, text FROM Review JOIN Person ON Review.personid = Person.id;", errorHandle.bind(null, "Prepared statement", eventEmitter));
      eventEmitter.on("Success: Prepared statement", getAllResults.bind(null, response, url, ps));
   }

   function getAllResults(response, url, ps) {
      ps.all(setReply.bind(null, response, url));
      ps.finalize();
   }

   function errorHandle(string, eventEmitter, error) {
   //   console.log("outside conditional, error: " + JSON.stringify(error));
   //   console.log("outside conditional, string: " + JSON.stringify(string));

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

   function setReply(response, url, error, rows) {
      if (error) {
         console.log("setReply() - error");

         console.log("Error: " + error);
      //   eventEmitter.emit("Error");
         failureReply(response, url);
      }
      else {
         console.log("setReply() - success");

         //eventEmitter.emit("Success");
         successReply(response, url, rows);
      }
   }

   function failureReply(response, url) {
      var file = "." + url;
      FS.readFile(file, failure.bind(null, response));
   }

   // Deliver the file that has been read in to the browser.
   function failure(response, error, fileContent) {
      var textTypeHeader = { "Content-Type": "text/plain" };
      response.writeHead(NotFound, "File not found");
      response.write(fileContent, "utf8");
      response.end();
   }

   function successReply(response, url, rows) {
      var file = "." + url;
      FS.readFile(file, success.bind(null, response, rows));
   }

   // Deliver the file that has been read in to the browser.
   function success(response, rows, error, fileContent) {
/*
      var util = require("util");
      console.log("sucess - response: " + util.inspect(db, {showHidden: false, depth: null}));
      console.log("sucess - url: " + util.inspect(request, {showHidden: false, depth: null}));
      console.log("sucess - error: " + util.inspect(response, {showHidden: false, depth: null}));
      console.log("sucess - fileContent: " + util.inspect(response, {showHidden: false, depth: null}));
*/
      console.log("success - Rows after being stringified: " + JSON.stringify(rows));

      var typeHeader = { "Content-Type": "text/html" };
      response.writeHead(OK, typeHeader);

      var fillWithData = "";
      for (var i = 0; i < Object.keys(rows).length; i++) {  //Use first and last names instead!
         fillWithData = fillWithData.concat('<div class="review"><h3>' + '&quot;' + rows[i].title + '&quot;' + ' - ' + rows[i].firstName + ' ' + rows[i].surname + '</h3><p>' + rows[i].text + '</p></h3></div>');
      //   fillWithData.concat("</h3><p>" + rows[i].text + "</p></h3></div");
      }

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div id="reviews"></div>', '<div id="reviews">' + fillWithData + '</div>');

      console.log("fillWithData: " + fillWithData);
      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }
