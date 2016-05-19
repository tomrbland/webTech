"use strict";

addEventListener("load", connectButton);

function connectButton(){
   var button = document.querySelector("#addReviewButton");
   var close = document.querySelector(".closeWriteReview");
   button.addEventListener("click", clicked);
   close.addEventListener("click", closeAddReview);
}

function clicked(){
   //IF NOT LOGGED IN REDIRECT TO LOGIN? or open a login pop-up (nicer UX?)?
   var button = document.querySelector("#dim");
   button.style.display = "block";
}

function closeAddReview(){
   var button = document.querySelector("#dim");
   button.style.display = "none";
}
