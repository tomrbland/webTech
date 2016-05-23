   "use strict";

   //Imports
   var REGISTER = require('./registerAction.js');

   //Exports
   module.exports = {
      route: function(response, url, userInput){
         _route(response, url, userInput);
      }
   };

   function _route(response, url, userInput) {
      console.log("actionRouter.js - userInput: " + JSON.stringify(userInput));

      switch(userInput.actionType) {
         case "register": REGISTER.executeAction(response, url, userInput); break;
      // default: ......... break;
      }
   }
