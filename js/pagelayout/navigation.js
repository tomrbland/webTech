"use strict";

addEventListener("load", addNavigation);

function addNavigation(){
   console.log("navigation.js: addNavigation - event on load");
   var navBar = document.querySelector("#nav");

   navBar.appendChild(makeDiv("/index.html", "Home"));

   function makeDiv(path, text){
      var div = document.createElement("div");
      div.className = "navButton";

      var a = document.createElement("a");
      a.href = path;
      a.innerHTML = text;

      div.appendChild(a);
      return div;
   }
}
