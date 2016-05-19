   "use strict";

   /*
    * Generic untility functions
    */

   //Imports

   //Exports
   module.exports = {
      // Check whether a string starts with a prefix
      starts: function (s, x) {
         return s.lastIndexOf(x, 0) == 0;
      },

      //or ends with a suffix
      ends: function (s, x) {
         return s.indexOf(x, s.length-x.length) >= 0;
      },

      lower: function (s) {
          return s.toLowerCase();
      }
   };

   //Code
