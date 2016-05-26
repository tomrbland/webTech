   "use strict";

   //Imports
   var ACTION_ROUTER = require("./actionRouter");
   var RESORT_REPLIER = require("./resortReply.js");
   var LOGIN_STATUS_REPLIER = require("./loginReply.js");
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

         case "/resort.html": RESORT_REPLIER.reviewsQueryThenReply(response, url, db); break;

         case "/loginconfirmation.txt": LOGIN_STATUS_REPLIER.confirmLoginStatus(response, url, db, userInput); break;

         default: STANDARD_REPLIER.reply(response, url, type); break;
      }
   }
