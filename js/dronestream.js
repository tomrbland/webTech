
   /*  First attempt (which worked on Safari w/o the server) */

   /* The CORS stuff I couldn't get working
   var cors = require('cors');
   var app = express()
   app.use(cors()) */

   var url = "http://api.dronestre.am/data";

   var xhr = new XMLHttpRequest();

   xhr.onload = function() {
      document.write("<h1>" + "Data Visualisation Experiments" + "</h1>");
      if (xhr.status === 200) {
         document.write("<p>" + "Response check." + "</p>");
         responseObject = JSON.parse(xhr.responseText);

         // Build up the string with new content
         var newContent = "<p>";
         for (var i = 0; i < responseObject.strike.length; i++) {
            // Parses the country of each drone strike event
            newContent += " " + responseObject.strike[i].country + " ";
         }
         newContent += "</p>";
         document.write(newContent);
      }
      document.write("<p>" + "<a href='index.html'>" + "BACK" + "</a>" + "</p>");
   };

   xhr.open("GET", url, true);
   xhr.send(null);


   /*
   Code from: https://www.nczonline.net/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing/

   Tried to get it working w/o a server - hence why I'm not writing with DOM.
   Still throws a CORS error.

   function createCORSRequest(method, url) {
       var xhr = new XMLHttpRequest();
       if ("withCredentials" in xhr){
           xhr.open(method, url, true);
       }
       else if (typeof XDomainRequest !== "undefined"){
           xhr = new XDomainRequest();
           xhr.open(method, url);
       }
       else {
           xhr = null;
       }
       return xhr;
   }

   var request = createCORSRequest("GET", "http://api.dronestre.am/data");
   if (request) {
       request.onload = function() {
          if (xhr.status === 200) {
             document.write("<p>" + "Response check." + "</p>");
             responseObject = JSON.parse(xhr.responseText);

             // Build up the string with new content
             var newContent = "<p>";
             for (var i = 0; i < responseObject.strike.length; i++) {
                // Parses the country of each drone strike event
                newContent += " " + responseObject.strike[i].country + " ";
             }
             newContent += "</p>";
             document.write(newContent);
          }
     };
     request.send();
   }
*/



   /* Ian's code
   "use strict";

   var url = "http://api.dronestre.am/data";

   var request = new XMLHttpRequest();
   request.onreadystatechange = receive;
   request.open("GET", url, true);
   request.send(null);

   function receive() {
      if (this.readyState != XMLHttpRequest.DONE) {
         return;
      }
      else {
         var pelement = document.createElement("p");
         var textnode = document.createTextNode("Response OK");
         pelement.appendChild(textnode);
         document.getElementById("responseCheck").appendChild(pelement);
      }
   } */
