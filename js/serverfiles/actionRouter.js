   "use strict";

   //Imports
   var REPLIER = require('./reply.js');
   var DB_MANAGER = require('./dbManager.js');
   var REGISTER_ACTION = require('./registerAction.js');

   //Exports
   module.exports = {
      route: function(response, url, userInputParams){
         _route(response, url, userInputParams);
      }
   };

   function _route(response, url, userInputParams) {
      console.log("actionRouter.js - userInputParams: " + JSON.stringify(userInputParams));
      switch(userInputParams.actionType) {
         case "register":
            console.log("actionRouter.js - actionType: register ");
            REGISTER_ACTION.register(response, url, userInputParams);
         break;
      // default: ......... break;
      }
   }
