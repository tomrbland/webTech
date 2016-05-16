//Imports
   var FS = require('fs');
   var UTIL = require('./utilities.js');
   var REPLIER = require('./genericUrlReply.js');

//Exports
   module.exports = {
      handle: function(request, response){
         _handle(request, response);
      }
   };

//Code
   function _handle(request, response) {
      console.log("Method:", request.method);
      console.log("URL:", request.url);
      console.log("Headers:", request.headers);

      var url = request.url;
      if (UTIL.ends(url, "/")) url = url + "index.html";
      if (! UTIL.ends(url, ".html")) return REPLIER.fail(response, BadType, "Not .html");
      var file = "." + url;
      FS.readFile(file, REPLIER.reply.bind(null, response));
   }
