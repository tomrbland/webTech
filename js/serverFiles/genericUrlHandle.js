//Imports
   var replier = require('./genericUrlReply.js');

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
      replier.reply(response);
   }
