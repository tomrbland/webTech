"use strict";

addEventListener("load", buildHeader);
var resortName;

function buildHeader() {
   console.log("resortHeader.js: buildHeader - event on load");
   var header = document.querySelector("#resort");
   var h2 = document.createElement('h2');

   var data = window.location.search.replace("?", "");
   data = decodeURI(data);
   data = data.split('+').join(' ');
   data = data.split('%2C').join(',');
   var parts = data.split("=");
   resortName = parts[1];
   console.log("resortHeader.js: Global resortName set");
   h2.innerHTML = resortName;

   header.appendChild(h2);
}
