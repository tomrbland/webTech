//Imports
   var UTIL = require('./utilities.js');
   var URL_UTIL = require('./urlUtils.js');
   var REPLIER = require('./reply.js');

//Exports
   module.exports = {
      handle: function(request, response){
         _handle(request, response);
      }
   };

//Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _handle(request, response) {
      var url = request.url;
      url = URL_UTIL.removeQuery(url);
      url = UTIL.lower(url);
      url = URL_UTIL.addIndex(url);
      if (! URL_UTIL.valid(url)) return REPLIER.fail(response, NotFound, "Invalid URL");
      if (! URL_UTIL.safe(url)) return REPLIER.fail(response, NotFound, "Unsafe URL");
      if (! URL_UTIL.shouldOpen(url)) return REPLIER.fail(response, NotFound, "URL has been banned");
      var type = URL_UTIL.findType(url);
      if (type == null) return REPLIER.fail(response, BadType, "File type unsupported");
      if (type == "text/html") type = URL_UTIL.negotiate(request.headers.accept);
      REPLIER.reply(response, url, type);
   }
