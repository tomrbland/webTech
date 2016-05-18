"use strict";

addEventListener("load", addNavigation);

function addNavigation(){
   console.log("navigation.js: addNavigation - event on load");
   var navBar = document.querySelector("#nav");

   navBar.appendChild(makeDiv("/index.html", "Home", "left"));
   navBar.appendChild(makeDiv("/login.html", "Login", "right"));
   navBar.appendChild(makeDiv("/register.html", "Register", "right"));

   function makeDiv(path, text, float){
      var div = document.createElement("div");

      if(float === "left") div.className = "navButtonLeft";
      else div.className = "navButtonRight";

      var a = document.createElement("a");
      a.href = path;
      a.innerHTML = text;

      div.appendChild(a);
      return div;
   }
}
