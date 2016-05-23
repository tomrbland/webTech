   "use strict";

   //Imports
   var ACTION_ROUTER = require("./actionRouter")
   var DB_MANAGER = require("./dbManager.js");
   var REPLIER = require("./reply.js");

   //Exports
   module.exports = {
      handleURL: function(response, url, type, userInput){
         _handleURL(response, url, type, userInput);
      }
   };

   function _handleURL(response, url, type, userInput) {
      switch (url) {
         case "/action.html": ACTION_ROUTER.route(response, url, userInput); break;
         // the reviewsQuery should be performed via an action but will leave it as it is for now.
         case "/js/serverfiles/reviewsquery.js": DB_MANAGER.route(url, response); break;
         // rename replier... Have distinction between standard reply and dynamic reply? Dynamic = with action.html
         default: REPLIER.reply(response, url, type); break;
      }
   }
