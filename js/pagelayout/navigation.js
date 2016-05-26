   "use strict";

   addEventListener("load", addNavigation);

   function addNavigation() {
      var userSessionID;
      var username;

      //Get the navBar
      console.log("navigation.js: addNavigation - event on load");
      var navBar = document.querySelector("#nav");

      //Left aligned items
      navBar.appendChild(makeButton("/index.html", "Home", "left"));
      navBar.appendChild(makeButton("/skifree/index.html", "Skifree!", "left"));

      //Right Aligned Items
      if (getUserSessionIDandUsername()) {
         console.log("username: ", username);
         navBar.appendChild(makeFakeButton("Logout", "right", logout));
         navBar.appendChild(makeText("Logged in as: "+username, "right"));
      }
      else{
         navBar.appendChild(makeButton("/login.html", "Login", "right"));
         navBar.appendChild(makeButton("/register.html", "Register", "right"));
      }
      //END

      //Functions
      function makeButton(path, text, float) {
         var div = document.createElement("div");

         if(float === "left") div.className = "navButtonLeft";
         else div.className = "navButtonRight";

         var a = document.createElement("a");
         a.href = path;
         a.innerHTML = text;

         div.appendChild(a);
         return div;
      }

      function makeFakeButton(text, float, listener) {
         var div = document.createElement("div");

         if(float === "left") div.className = "navButtonLeft";
         else div.className = "navButtonRight";

         var a = document.createElement("a");
         a.href = "";
         a.innerHTML = text;

         div.appendChild(a);
         div.addEventListener("click", listener);

         return div;
      }

      function makeText(text, float) {
         var div = document.createElement("div");

         if(float === "left") div.className = "navTextLeft";
         else div.className = "navTextRight";

         var p = document.createElement("p");
         p.innerHTML = text;

         div.appendChild(p);
         return div;
      }

      function getUserSessionIDandUsername() {
         userSessionID = sessionStorage.getItem("userSessionID");
         username = sessionStorage.getItem("username");
         if (typeof userSessionID === "undefined" || typeof username === "undefined" ||
            userSessionID === null || username == null) return false;
         else {
            return true;
         }
      }

      function logout() {
         userSessionID = sessionStorage.removeItem("userSessionID");
         username = sessionStorage.removeItem("username");
      }
   }
