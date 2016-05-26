   "use strict";

   //Imports
   var UTIL = require("./utilities.js");
   var URL_UTIL = require("./urlUtils.js");
   var REPLIER = require("./standardreply/standardReply.js");
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
      var url = request.url;

      // Turns /resort.html?resort=Les+Arcs%2C+Bourg-Saint-Maurice%2C+France, for example,
      // into /resort.html
      url = URL_UTIL.removeQuery(url);

      url = UTIL.lower(url);

      // Makes localhost:8080 default to index.html
      url = URL_UTIL.addIndex(url);

      if (! URL_UTIL.valid(url)) return REPLIER.fail(response, NotFound, "Invalid URL");
      if (! URL_UTIL.safe(url)) return REPLIER.fail(response, NotFound, "Unsafe URL");
      if (! URL_UTIL.shouldOpen(url)) return REPLIER.fail(response, NotFound, "URL has been banned");

      var type = URL_UTIL.findType(url);
      if (type == null) return REPLIER.fail(response, BadType, "File type unsupported");

      // If a browser accepts XHTML, change type to XHTML
      if (type == "text/html") type = URL_UTIL.negotiate(request.headers.accept);

      request.on("data", add);
      request.on("end", end);

      var body = "";

      function add(chunk) {
         body = body + chunk.toString();
      }

      function end() {
         var userInput = QUERY_STRING.parse(body);
         HANDLER.handleURL(response, url, type, db, userInput);
      }
   }
