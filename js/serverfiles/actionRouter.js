   "use strict";

   //Imports
   var REGISTER = require('./registerAction.js');

   //Exports
   module.exports = {
      route: function(response, url, userInputParams){
         _route(response, url, userInputParams);
      }
   };

   function _route(response, url, userInputParams) {
      console.log("actionRouter.js - userInputParams: " + JSON.stringify(userInputParams));

      switch(userInputParams.actionType) {
         case "register": REGISTER.executeAction(response, url, userInputParams); break;
      // default: ......... break;
      }
   }
