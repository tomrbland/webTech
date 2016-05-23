   "use strict";

   //Imports
   var UTIL = require("./utilities.js");
   var URL_UTIL = require("./urlUtils.js");
   var REPLIER = require("./standardReply.js");
   var HANDLER = require("./handler.js");

   var QUERY_STRING = require("querystring");

   //Exports
   module.exports = {
      validate: function(db, request, response){
         _validate(db, request, response);
      },
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _validate(db, request, response) {
      /*
      var util = require("util");
      console.log("validate.js - db: " + util.inspect(db, {showHidden: false, depth: null}));
      console.log("validate.js - request: " + util.inspect(request, {showHidden: false, depth: null}));
      console.log("validate.js - response: " + util.inspect(response, {showHidden: false, depth: null}));
      */

      var url = request.url;

      // Turns /resort.html?resort=Les+Arcs%2C+Bourg-Saint-Maurice%2C+France into /resort.html
      url = URL_UTIL.removeQuery(url);

      url = UTIL.lower(url);

      // Makes localhost:8080 default to index.html
      url = URL_UTIL.addIndex(url);

      if (! URL_UTIL.valid(url)) return REPLIER.fail(response, NotFound, "Invalid URL");
      if (! URL_UTIL.safe(url)) return REPLIER.fail(response, NotFound, "Unsafe URL");
      if (! URL_UTIL.shouldOpen(url)) return REPLIER.fail(response, NotFound, "URL has been banned");

      var type = URL_UTIL.findType(url);
      if (type == null) return REPLIER.fail(response, BadType, "File type unsupported");

      //If a browser accepts XHTML, change type to XHTML
      if (type == "text/html") type = URL_UTIL.negotiate(request.headers.accept);

      request.on("data", add);
      request.on("end", end);

      var body = "";

      function add(chunk) {
         body = body + chunk.toString();
      }

      function end() {
         console.log("urlValidation.js - URL before entering handler: " + url);
         var userInput = QUERY_STRING.parse(body);
         HANDLER.handleURL(response, url, type, userInput, db);
      }
   }
