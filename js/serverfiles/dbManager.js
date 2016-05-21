   "use strict";

   //Imports
   var DB_REVIEWS_QUERY = require("./reviewsQuery.js");

   //Exports
   module.exports = {
      route: function(url, response){
         _route(url, response);
      }
   };

   function _route(url, response) {
      switch (url) {
         case "/js/serverfiles/reviewsquery.js":
            console.log("URL going into reviewsQuery() " + url);
            console.log("response before going into reviewsQuery()" + response);
            DB_REVIEWS_QUERY.reviewsQuery(response);
         break;
         default: console.log("Error in routing.");
      }
   }




/*
   "use strict";

   //Imports

   var DB_INSERT_USER = require("./insertUser.js");

   //Exports
   module.exports = {
      route: function(url, userInputParams, response){
         _route(url, userInputParams, response);
      }
   };

   function _route(url, userInputParams, response) {
   //   console.log("url before route switch: " + url);
      switch (url) {
         case "/js/serverfiles/db/dbrequests/reviewsdata.txt":
            console.log("dbManager.js - URL going into reviewsQuery() " + url);
            console.log("dbManager.js - response before going into reviewsQuery()" + response);

            DB_REVIEWS_QUERY.reviewsQuery(response);
         break;

         case "/js/serverfiles/db/dbrequests/registeruser.txt":
            console.log("dbManager.js - URL going into insertUser() " + url);
            console.log("dbManager.js -response before going into insertUser()" + response);
            console.log("dbManager.js - userInputParams for registerUser: " + userInputParams);
            console.log("dbManager.js - userInputParams.username for registerUser: " + userInputParams.username);
            console.log("dbManager.js - userInputParams.emailaddress for registerUser: " + userInputParams.emailaddress);
            console.log("dbManager.js - userInputParams.password for registerUser: " + userInputParams.password);

            DB_INSERT_USER.insertUser(response);
         break;

         default: console.log("Error in routing.");
      }
   }
*/
