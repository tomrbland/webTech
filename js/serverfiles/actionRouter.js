   "use strict";

   //Imports
   var REGISTER = require('./registerAction.js');
   var LOGIN = require('./loginAction.js');

   //Exports
   module.exports = {
      route: function(response, url, db, userInput){
         _route(response, url, db, userInput);
      }
   };

   function _route(response, url, db, userInput) {
      console.log("actionRouter.js - userInput: " + JSON.stringify(userInput));

      switch(userInput.actionType) {
         case "register": REGISTER.executeAction(response, url, db, userInput); break;
         case "login": LOGIN.executeAction(response, url, db, userInput); break;
         case "addReview": console.log("hello addReview"); break;
      // default: ......... break;
      }
   }
