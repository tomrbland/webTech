   "use strict";

   //Imports

   //Exports
   module.exports = {
      handle: function(request, response){
         _handle(request, response);
      }
   };

   //Code https://en.wikipedia.org/wiki/URL_redirection
   var OK = 200, NotFound = 404, BadType = 415, Error = 500, Redirect = 308;

   function _handle(request, response) {
      var url = request.url;
      response.writeHead(Redirect, {Location: 'https://localhost:8443' + url});
      response.end();
   }
