"use strict";

/**
 * Adds current URL to form on the register page.
 * Used to redirect back to where the user came from.
 */

if (addEventListener) {
   addEventListener("load", getURL);
}
else {
   attachEvent("onload", getURL);
}


function getURL(){
   var url;

   function url(){
      url = window.location.href;
   }

   function writeToForm(){
      var form = document.querySelector("#currentURL");
      forum.value = url;
   }
}
