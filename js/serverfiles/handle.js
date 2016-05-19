   "use strict";

   //Imports
   var UTIL = require('./utilities.js');
   var URL_UTIL = require('./urlUtils.js');
   var REPLIER = require('./reply.js');
   //var QUERYDB = require('./queryAllReviewText.js');
   var DBMANAGER = require('./dbManager.js');

   //Exports
   module.exports = {
      handle: function(request, response){
         _handle(request, response);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _handle(request, response) {
      // console.log(request);
      // e.g. /index.html
      var url = request.url;

      // Turns /resort.html?resort=Les+Arcs%2C+Bourg-Saint-Maurice%2C+France into /resort.html
      url = URL_UTIL.removeQuery(url);

      // Makes it lower case
      url = UTIL.lower(url);

      // Makes localhost:8080 default to index.html
      url = URL_UTIL.addIndex(url);

      if (! URL_UTIL.valid(url)) return REPLIER.fail(response, NotFound, "Invalid URL");
      if (! URL_UTIL.safe(url)) return REPLIER.fail(response, NotFound, "Unsafe URL");
      if (! URL_UTIL.shouldOpen(url)) return REPLIER.fail(response, NotFound, "URL has been banned");

      // Finds type of file, e.g. if it's a .png
      var type = URL_UTIL.findType(url);
      if (type == null) return REPLIER.fail(response, BadType, "File type unsupported");

      //If a browser accepts XHTML, change type to XHTML
      if (type == "text/html") type = URL_UTIL.negotiate(request.headers.accept);

      if (url.includes("/js/db/")) {
         console.log("~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~ URL DOES INCLUDE /js/db/ ~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~/~");
         console.log("URL going into dbManager " + url);
         console.log("response before going into dbManager" + response);

         DBMANAGER.route(url, response);
      }
      else {
         console.log("URL going to reply.js: " + url);
         REPLIER.reply(response, url, type);
      }
   }
