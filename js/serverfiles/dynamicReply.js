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
   }

   function reviewsQuery(response, url, db, eventEmitter) {
      var ps = db.prepare("SELECT firstName, surname, title, text FROM Review JOIN Person ON Review.personid = Person.id;", errorHandle.bind(null, "Prepared statement", eventEmitter));
      eventEmitter.on("Success: Prepared statement", getAllResults.bind(null, response, url, ps, eventEmitter));
   }

   function getAllResults(response, url, ps, eventEmitter) {
      ps.all(setReply.bind(null, response, url));
      ps.finalize(errorHandle.bind(null, "Finalized", eventEmitter));
   }

   function errorHandle(string, eventEmitter, error) {
      if (error) {
         eventEmitter.emit("Error", error);
      }
      else {
         eventEmitter.emit("Success: ".concat(string));
      }
   }

   function setReply(response, url, error, rows) {
      if (error) {
         failureReply(response, url, error);
      }
      else {
         successReply(response, url, rows);
      }
   }

   function failureReply(response, url) {
      var file = "." + url;
      FS.readFile(file, failure.bind(null, response));
   }

   function failure(response, error, fileContent) {
      var typeHeader = { "Content-Type": "text/html" };
      response.writeHead(OK, typeHeader);

      var fillData = "";
      for (var i = 0; i < 4; i++) {
         fillData = fillData.concat('<div class="review"><h3>' + 'Error in retrieving reviews from the database</h3><p></p></h3></div>');
      }

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div id="reviews"></div>', '<div id="reviews">' + fillData + '</div>');

      response.write(fileContent);
      response.end();
   }

   function successReply(response, url, rows) {
      var file = "." + url;
      FS.readFile(file, success.bind(null, response, rows));
   }

   function success(response, rows, error, fileContent) {
      var typeHeader = { "Content-Type": "text/html" };
      response.writeHead(OK, typeHeader);

      var fillData = "";
      for (var i = 0; i < Object.keys(rows).length; i++) {  //Use first and last names instead!
         fillData = fillData.concat('<div class="review"><h3>' + '&quot;' + rows[i].title + '&quot;' + ' — ' + rows[i].firstName + ' ' + rows[i].surname + '</h3><p>' + rows[i].text + '</p></h3></div>');
      }

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div id="reviews"></div>', '<div id="reviews">' + fillData + '</div>');

      response.write(fileContent);
      response.end();
   }
