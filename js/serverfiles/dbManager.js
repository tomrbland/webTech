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
      //should create a directory of empty files for db requests.
      if (url == "/js/db/reviewquerytest.js") {
         console.log("URL going into getAllReviewText() " + url);
         console.log("response before going into getAllReviewText()" + response);
         QUERYDB.getAllReviewText(response);
      }
   }

   /*
      function work(func) {
          alert("I am calling the callback!");
          func();
      }

      function callback() {
         alert("I am in the callback!");
      }

      work(callback);
      */
