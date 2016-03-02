"use strict";
addEventListener("load", buildHeader);

function buildHeader() {
   var header = document.querySelector("header");
   var h1 = document.createElement('h1');

   var url = location.href;
   var parts = url.split("?");
   if (parts.length < 2) {
     message.data = "No parameters found.";
     return;
   }
   var paramstring = parts[1];
   var params = paramstring.split("&");

   var def = params[i].split("=");
   var name = def[0];
   var value = def[1];
   h1.innerHTML = value;
   header.appendChild(h1);
}
