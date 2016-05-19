"use strict";

/**
 * Stores current URL.
 * Used to redirect back to where the user came from.
 * requires sessionstorage.js
 */

if (addEventListener) {
   addEventListener("load", storeurl);
}
else {
   attachEvent("onload", storeurl);
}

function storeurl(){
   var url = window.location.href;
   console.log("Storing: ", url);
   sessionStorage.setItem("currenturl", url);
   console.log("Stored: ", sessionStorage.getItem.currenturl);
}
