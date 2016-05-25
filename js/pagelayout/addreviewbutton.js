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

      function amILoggedIn(){

         /*// Uncomment to bypass login check
         var reviewWriter = document.querySelector("#dim");
         reviewWriter.style.display = "block";*/

         var xhr = new XMLHttpRequest();
         var data = "userSessionID="+userSessionID+"&username="+username;

         xhr.open("POST", "js/db/amILoggedIn", true);
         xhr.onreadystatechange = gotReply;
         xhr.send(data);
      }

      function gotReply(){
         if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === "Yes") {
               var reviewWriter = document.querySelector("#dim");
               reviewWriter.style.display = "block";
            }
            else {
               window.location.href="/login.html";
            }
         }
      }

      function completeForm(){
         var formUID = document.querySelector("#formuid");
         var formUsername = document.querySelector("#formusername");
         formUID.value = userSessionID;
         formUsername.value = username;
      }
   }
