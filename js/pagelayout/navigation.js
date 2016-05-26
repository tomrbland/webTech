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

      //your standard button. Click me I take you somewhere
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

      //Fake button looks like a button but doesn't go anywhere
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

      //Just text. No button features
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
         var xhr = new XMLHttpRequest();
         var data = "userSessionID="+userSessionID+"&username="+username;

         console.log("Logging out");
         xhr.open("POST", "logout.txt", true);
         xhr.onreadystatechange = loggedout;
         xhr.send(data);
         console.log("Sent Request");
      //   userSessionID = sessionStorage.removeItem("userSessionID");
      //   username = sessionStorage.removeItem("username");
      }

      function loggedout(){
         console.log("Recieved Reply");
         console.log("readyState:", this.readyState, " status:", this.status);
         if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === "Logout successful") {
               console.log("loggedout");
               userSessionID = sessionStorage.removeItem("userSessionID");
               username = sessionStorage.removeItem("username");
            }
            else {
               console.log("FAILED");
               alert("Logout failed. Erm... now what?");
            }
         }
      }

   }
