"use strict";

/**
 * Stores current URL.
 * Used to redirect back to where the user came from.
 * requires sessionstorage.js
 */

storeurl();

function storeurl(){
   var url = window.location.href;
   sessionStorage.setItem("currenturl", url);
}
