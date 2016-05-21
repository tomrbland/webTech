   "use strict";

   //Imports
   var ACTION_ROUTER = require("./actionRouter")
   var DB_MANAGER = require("./dbManager.js");
   var REPLIER = require("./reply.js");

   //Exports
   module.exports = {
      handleURL: function(response, url, type){
         _handleURL(response, url, type);
      }
   };

   function _handleURL(response, url, type) {
      switch (url) {
         case "action.html":
            ACTION_ROUTER.route(response, url, type);
         break;
         case "/js/db/reviewquerytest.js":
            DB_MANAGER.route(url, response);
         break;
         default: REPLIER.reply(response, url, type);
      }
   }
