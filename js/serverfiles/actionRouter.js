   "use strict";

   //Imports
   var REPLIER = require('./reply.js');
   var DB_MANAGER = require('./dbManager.js');

   //Exports
   module.exports = {
      route: function(response, url, type, userInputParams){
         _route(response, url, type, userInputParams);
      }
   };

   function _route(response, url, type, userInputParams) {
      console.log("actionRouter.js - userInputParams: " + JSON.stringify(userInputParams));
      switch(userInputParams.actionType) {
         case "register":
            console.log("actionRouter.js - actionType: register ");
         //   register();
         break;
      // default: ......... break;
      }
   }
   /*
   function register() {

   }
   */
