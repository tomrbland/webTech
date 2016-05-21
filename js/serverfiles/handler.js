   "use strict";

   //Imports
   var REPLIER = require('./reply.js');
   var DB_MANAGER = require('./dbManager.js');

   //Exports
   module.exports = {
      route: function(response, url, type){
         _route(response, url, type);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _route(response, url, type) {
      switch (url) {
         case "action.html":
            console.log("action.html");
         break;
         case "/js/db/reviewquerytest.js":
            DB_MANAGER.route(url, response);
         break;
         default: REPLIER.reply(response, url, type);
      }
   }
