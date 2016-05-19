"use strict";

addEventListener("load", connectButton);

function connectButton(){
   var button = document.querySelector("#addReviewButton");
   var close = document.querySelector("#closeButton");
   button.addEventListener("click", clicked);
   close.addEventListener("click", closeAddReview);
}

function clicked(){
   console.log("CLICKED");
   var button = document.querySelector("#dim");
   button.style.display = "block";
}

function closeAddReview(){
   console.log("CLICKED");
   var button = document.querySelector("#dim");
   button.style.display = "none";
}
