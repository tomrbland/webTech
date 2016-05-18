"use strict";

var requestFinished = 4, successfulRequest = 200;
var numOfReviews = 10;
var loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

if (addEventListener) {
   addEventListener("load", addReviews);
}
else {
   attachEvent("onload", addReviews);
}

function addReviews() {
   console.log("reviews.js: addReviews - event on load. REQUIRES global resortName");

   var reviewText = queryDBAndOnResultReturn(constructReviews);
}

function queryDBAndOnResultReturn(callbackFunct) {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "js/db/reviewQuery.js", true);

   xhr.onreadystatechange = function() {
      if ((xhr.readyState === requestFinished) && (xhr.status === successfulRequest)) {
         console.log("reviews.js: Response OK from js/db/reviewQuery.js.");
         console.log("responseText: " + xhr.responseText);

         var queryResult = xhr.responseText;
         callbackFunct(queryResult);
      }
   };
   xhr.send();
}

function constructReviews(queryResult) {
   console.log("queryResult: " + queryResult);

   for(var i = 0; i < numOfReviews; i++){
      var review = document.createElement("div");
      review.className = "review";

      var h3 = document.createElement("h3");
      h3.innerHTML = i + 1 + ". A Review for " + resortName;

      var p = document.createElement("p");
      p.innerHTML = queryResult;

      review.appendChild(h3);
      review.appendChild(p);

      var parent = document.querySelector("#reviews");
      parent.appendChild(review);
   }
}
