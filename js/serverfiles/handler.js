   "use strict";

   //Imports
   var ACTION_ROUTER = require("./actionRouter")
   var DB_MANAGER = require("./dbManager.js");
   var REPLIER = require("./reply.js");

   //Exports
   module.exports = {
      handleURL: function(response, url, type, userInputParams){
         _handleURL(response, url, type, userInputParams);
      }
   };

   function _handleURL(response, url, type, userInputParams) {
      switch (url) {
         case "/action.html":
            ACTION_ROUTER.route(response, url, type, userInputParams);
         break;
         // the reviewsQuery should be performed via an action but will leave it as it is for now.
         case "/js/serverfiles/reviewsquery.js":
            DB_MANAGER.route(url, response);
         break;
         default: REPLIER.reply(response, url, type);
      }
   }
