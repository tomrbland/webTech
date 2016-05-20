"use strict";

addEventListener("load", connectButton);

function connectButton(){
   var button = document.querySelector("#addReviewButton");
   var close = document.querySelector(".closeWriteReview");
   button.addEventListener("click", amILoggedIn);
   close.addEventListener("click", closeAddReview);

   function closeAddReview(){
      var button = document.querySelector("#dim");
      button.style.display = "none";
   }

   function amILoggedIn(){
      var uid = sessionStorage.getItem("uid");
      var username = sessionStorage.getItem("username");
      var xhr = new XMLHttpRequest();
      var data = "uid="+uid+"&username="+username;

      xhr.open("POST", "js/db/amILoggedIn", true);
      xhr.onreadystatechange = gotReply;
      xhr.send(data);

      return false;
   }

   function gotReply(){
      if(this.readyState == 4 && this.status == 200) {
         if(this.responseText === "ok"){
            var reviewWriter = document.querySelector("#dim");
            reviewWriter.style.display = "block";
         }
         else{
            window.location.href="/login.html";
         }
      }
   }
}
