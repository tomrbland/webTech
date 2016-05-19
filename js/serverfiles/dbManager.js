   "use strict";

   //Imports
   var QUERYDB = require('./queryAllReviewText.js');

   //Exports
   module.exports = {
      route: function(url, response){
         _route(url, response);
      }
   };

   function _route(url, repsonse) {
      if (url == "/js/db/reviewquerytest.js") {
         console.log("URL going into getAllReviewText() " + url);
         console.log("response before going into getAllReviewText()" + response);
         QUERYDB.getAllReviewText(response);
      }
   }
