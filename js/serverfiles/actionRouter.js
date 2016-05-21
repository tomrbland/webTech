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

   function _route(response, url, type) {
      console.log("URL in actionRouter: " + url);
      console.log();
   }
