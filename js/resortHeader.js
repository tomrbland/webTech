"use strict";
addEventListener("load", buildHeader);

function buildHeader() {
   var header = document.querySelector("header");
   var h1 = document.createElement('h1');

   var data = window.location.search.replace("?", "");
   var parts = data.split("=");
   h1.innerHTML = parts[1];

   header.appendChild(h1);
}
