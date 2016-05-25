   "use strict";

   addEventListener("load", connectButton);

   function connectButton(){
      var button = document.querySelector("#addReviewButton");
      var close = document.querySelector(".closeWriteReview");
      var userSessionID = sessionStorage.getItem("userSessionID");
      var username = sessionStorage.getItem("username");
      button.addEventListener("click", amILoggedIn);
      close.addEventListener("click", closeAddReview);
      completeForm();

      function closeAddReview(){
         var button = document.querySelector("#dim");
         button.style.display = "none";
      }

      function amILoggedIn() {
         if (getUserSessionIDandUsername()) {
            var reviewWriter = document.querySelector("#dim");
            reviewWriter.style.display = "block";
         }
         else {
            window.location.href="/login.html";
         }
      }

      function getUserSessionIDandUsername(){
         userSessionID = sessionStorage.getItem("userSessionID");
         username = sessionStorage.getItem("username");
         if(typeof userSessionID === "undefined" || typeof username === "undefined" ||
            userSessionID === null || username == null) return false;
         else return true;
      }

      function completeForm(){
         var formUID = document.querySelector("#formuid");
         var formUsername = document.querySelector("#formusername");
         formUID.value = userSessionID;
         formUsername.value = username;
      }
   }
