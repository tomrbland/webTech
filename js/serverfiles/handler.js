   "use strict";

   //Imports
   var ACTION_ROUTER = require("./actionRouter")
   var DYNAMIC_REPLIER = require("./dynamicReply.js");
   var STANDARD_REPLIER = require("./standardReply.js");

   //Exports
   module.exports = {
      handleURL: function(response, url, type, db, userInput){
         _handleURL(response, url, type, db, userInput);
      }
   };

   function _handleURL(response, url, type, db, userInput) {
      switch (url) {
         case "/action.html": ACTION_ROUTER.route(response, url, db, userInput); break;

         // The reviewsQuery should be performed via an action but will leave it as it is for now.
         case "/resort.html": DYNAMIC_REPLIER.reviewsQueryThenReply(response, url, db); break;

         default: STANDARD_REPLIER.reply(response, url, type); break;
      }
   }
