   "use strict";

   //Imports

   //Exports
   module.exports = {
      redirect: function(request, response){
         _redirect(request, response);
      }
   };

   //Code https://en.wikipedia.org/wiki/URL_redirection
   var OK = 200, NotFound = 404, BadType = 415, Error = 500, Redirect = 308;

   function _redirect(request, response) {
      var url = request.url;
      response.writeHead(Redirect, {Location: "https://localhost:8443" + url});
      response.end();
   }
