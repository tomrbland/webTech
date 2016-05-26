   "use strict";

   addEventListener("load", connectButton);

   function connectButton() {
      var button = document.querySelector("#addReviewButton");
      var close = document.querySelector(".closeWriteReview");
      var userSessionID = sessionStorage.getItem("userSessionID");
      var username = sessionStorage.getItem("username");
      button.addEventListener("click", loginConfirmation);
      close.addEventListener("click", closeAddReview);
      completeForm();

      function closeAddReview() {
         var button = document.querySelector("#dim");
         button.style.display = "none";
      }

      function loginConfirmation(){
         console.log("amILoggedIn");

         // Uncomment to bypass login check
         /*
         var reviewWriter = document.querySelector("#dim");
         reviewWriter.style.display = "block";
         */

         var xhr = new XMLHttpRequest();
         var data = "userSessionID="+userSessionID+"&username="+username;

         xhr.open("POST", "loginConfirmation.txt", true);
         xhr.onreadystatechange = gotReply;
         xhr.send(data);
      }

      function gotReply(){
         if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === "Logged in") {
               var reviewWriter = document.querySelector("#dim");
               reviewWriter.style.display = "block";
            }
            else if (this.responseText === "Logged in, but session ID timed out") {
               logout();
               alert("Your session timed out. Please login again.");
               window.location.href="/login.html";
            }
            else {
               alert("Please login.");
               window.location.href="/login.html";
            }
         }
      }

      function logout(){
         userSessionID = sessionStorage.removeItem("userSessionID");
         username = sessionStorage.removeItem("username");
      }

      function completeForm() {
         var formUserSessionID = document.querySelector("#formusersessionid");
         var formUsername = document.querySelector("#formusername");
         formUserSessionID.value = userSessionID;
         formUsername.value = username;
      }
   }
