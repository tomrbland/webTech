   "use strict";

   //Imports
   var ACTION_ROUTER = require("./dynamicreply/action/actionRouter.js");
   var RESORT_REPLIER = require("./dynamicreply/resortReply.js");
   var USER_LOGIN_AND_SESSION_STATUS_REPLIER = require("./dynamicreply/userLoginAndSessionStatusReply.js");
   var LOGOUT_REPLIER = require("./dynamicreply/logoutReply.js");
   var STANDARD_REPLIER = require("./standardreply/standardReply.js");

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

         case "/loginconfirmation.txt": USER_LOGIN_AND_SESSION_STATUS_REPLIER.confirmUserLoginAndSessionStatus(response, db, userInput); break;

         case "/logout.txt": LOGOUT_REPLIER.completeLogout(response, db, userInput); break;

         default: STANDARD_REPLIER.reply(response, url, type); break;
      }
   }
