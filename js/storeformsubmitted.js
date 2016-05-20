"use strict";

/**
 * Stores URL of where a form was submitted.
 * Used to redirect back to where the user came from.
 * requires sessionstorage.js
 */

storeurl();

function storeurl(){
   var url = window.location.href;
   sessionStorage.setItem("formsubmittedfrom", url);
}
