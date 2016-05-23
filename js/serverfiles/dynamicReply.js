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
      var ps = db.prepare("SELECT username, title, text FROM Review JOIN Person ON Review.personid = Person.id;", errorHandle.bind(null, "Prepared statement", eventEmitter));
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
         failureReply(response, url, rows);
      //   eventEmitter.emit("Error");
      }
      else {
         console.log("setReply() - success");

         //eventEmitter.emit("Success");
         successReply(response, url, rows);
      }
   }

   function failureReply(response, url) {
      console.log("failureReply()");

      var file = "." + url;
      FS.readFile(file, failure.bind(null, response, url));
   }

   function successReply(response, url, rows) {
      console.log("successReply()");
      console.log("reply - Rows after being stringified: " + JSON.stringify(rows));
      console.log("reply - Rows after being parsed: " );

      for (var i = 0; i < Object.keys(rows).length; i++) {
         console.log("reply - Row " + i + ": " + rows[i].username + ": " + rows[i].title + ": " + rows[i].text);
      }

      var file = "." + url;
      FS.readFile(file, success.bind(null, response, url, rows));
   }

   // Deliver the file that has been read in to the browser.
   function success(response, url, rows, error, fileContent) {
/*
      var util = require("util");
      console.log("sucess - response: " + util.inspect(db, {showHidden: false, depth: null}));
      console.log("sucess - url: " + util.inspect(request, {showHidden: false, depth: null}));
      console.log("sucess - error: " + util.inspect(response, {showHidden: false, depth: null}));
      console.log("sucess - fileContent: " + util.inspect(response, {showHidden: false, depth: null}));
*/
      console.log("success - Rows after being stringified: " + JSON.stringify(rows));

      var typeHeader = { 'Content-Type': "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      /*
      <div id="reviews"></div>
      var review = document.createElement("div");
      review.className = "review";

      var h3 = document.createElement("h3");
      h3.innerHTML = "\"" + parsedResults[i].title + "\"" + " - " + parsedResults[i].username;

      var p = document.createElement("p");
      p.innerHTML = parsedResults[i].text;
      */
      var fillWithData = "";

      console.log("\n test concat: " + fillWithData.concat("<div class= &quot;review&quot;><h3>" + rows[0].title + " - " + rows[0].username + "</h3><p>" + rows[0].text + "</p></h3></div"));
      for (var i = 0; i < Object.keys(rows).length; i++) {  //Use first and last names instead!
         fillWithData = fillWithData.concat("<div class='review'><h3>" + rows[i].title + " - " + rows[i].username + "</h3><p>" + rows[i].text + "</p></h3></div>");
      //   fillWithData.concat("</h3><p>" + rows[i].text + "</p></h3></div");
         console.log("fillWithData: " + fillWithData);
      }

      console.log("fillWithData: " + fillWithData);

      fileContent = fileContent.replace('<div id="reviews"></div>', '<div id="reviews">' + fillWithData + '</div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }

   // Deliver the file that has been read in to the browser.
   function failure(response, url, error, fileContent) {
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


/*
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
*/
