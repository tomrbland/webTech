"use strict";

if (addEventListener) {
   addEventListener("load", addReviews);
}
else {
   attachEvent("onload", addReviews);
}

function addReviews() {
   var requestFinished = 4, successfulRequest = 200;
   var loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

   console.log("reviews.js: addReviews - event on load. REQUIRES global resortName");
   queryDBAndOnResultReturn();

   function queryDBAndOnResultReturn() {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "js/serverfiles/reviewsQuery.js", true);

      xhr.onreadystatechange = stateChanged;
      xhr.send();
   }

   function stateChanged(){
      if ((this.readyState === requestFinished) && (this.status === successfulRequest)) {
         console.log("reviews.js: Response OK from js/serverfiles/reviewsQuery.js.");
         console.log("reviews.js - responseText: " + this.responseText);

         var queryResults = this.responseText;
         constructReviews(queryResults);
      }
   }

   function constructReviews(queryResults) {
      console.log("reviews.js - queryResults before JSON parsing: " + queryResults);
      var parsedResults = JSON.parse(queryResults);
      console.log("reviews.js - parsedResults: " + parsedResults);

      for (var k = 0; k < Object.keys(parsedResults).length; k++) {
         console.log("reviews.js - Row " + i + ": " + parsedResults[k].username + ": " + parsedResults[k].title + ": " + parsedResults[k].text);
      }

      for(var i = 0; i < k; i++){
         var review = document.createElement("div");
         review.className = "review";

         var h3 = document.createElement("h3");
         h3.innerHTML = "\"" + parsedResults[i].title + "\"" + " - " + parsedResults[i].username;

         var p = document.createElement("p");
         p.innerHTML = parsedResults[i].text;

         review.appendChild(h3);
         review.appendChild(p);

         var parent = document.querySelector("#reviews");
         parent.appendChild(review);
      }
   }
}
