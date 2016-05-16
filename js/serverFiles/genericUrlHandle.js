//Imports
   //var FS = require('fs');
   var UTIL = require('./utilities.js');
   var URL_UTIL = require('./handleUtils.js');
   var REPLIER = require('./genericUrlReply.js');

//Exports
   module.exports = {
      handle: function(request, response){
         _handle(request, response);
      }
   };

//Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _handle(request, response) {
      /*console.log("Method:", request.method);
      console.log("URL:", request.url);
      console.log("Headers:", request.headers);*/

      var url = request.url;
      url = URL_UTIL.removeQuery(url);
      url = UTIL.lower(url);
      url = URL_UTIL.addIndex(url);
      if (! URL_UTIL.valid(url)) return REPLIER.fail(response, NotFound, "Invalid URL");
      if (! URL_UTIL.safe(url)) return REPLIER.fail(response, NotFound, "Unsafe URL");
      if (! URL_UTIL.shouldOpen(url)) return REPLIER.fail(response, NotFound, "URL has been banned");
      var type = URL_UTIL.findType(url);
      if (type == null) return REPLIER.fail(response, BadType, "File type unsupported");
      if (type == "text/html") type = negotiate(request.headers.accept);
      REPLIER.reply(response, url, type);
   }

   // Do content negotiation, assuming all pages on the site are XHTML and
   // suitable for dual delivery.  Check whether the browser claims to accept the
   // XHTML type and, if so, use that instead of the HTML type.
   function negotiate(accept) {
       var htmlType = "text/html";
       var xhtmlType = "application/xhtml+xml";
       var accepts = accept.split(",");
       if (accepts.indexOf(xhtmlType) >= 0) return xhtmlType;
       else return htmlType;
   }
