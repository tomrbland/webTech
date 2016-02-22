   "use strict";

   addEventListener("load", start);

   function start()
   {
      var pelement = document.createElement("p");
      var textnode = document.createTextNode("TEST");
      pelement.appendChild(textnode);
      document.getElementById("test").appendChild(pelement);
   }

   var url = "http://api.dronestre.am/data";
   //var request = new XMLHttpRequest(true, true);

   var request = createCORSRequest('GET', url);
   if (!request) {
     throw new Error('CORS not supported');
   }


   //request.addEventListener("load", drones);
   request.onreadystatechange = drones;

   // replace url with "js/test.json" to see it working with the test file
   // true == asynchronous processing
   request.open("GET", url, true);
   request.send(null);

   function drones()
   {
      if(request.status === 200){
         var pelement = document.createElement("p");
         var textnode = document.createTextNode("Response OK");
         pelement.appendChild(textnode);
         document.getElementById("responseCheck").appendChild(pelement);
      }
      else{
         var pelement = document.createElement("p");
         var textnode = document.createTextNode("Response Not 200. is: " + request.status);
         pelement.appendChild(textnode);
         document.getElementById("responseCheck").appendChild(pelement);
      }
   }

   function createCORSRequest(method, url) {
     var xhr = new XMLHttpRequest();
     if ("withCredentials" in xhr) {

       // Check if the XMLHttpRequest object has a "withCredentials" property.
       // "withCredentials" only exists on XMLHTTPRequest2 objects.
       xhr.open(method, url, true);

     } else if (typeof XDomainRequest != "undefined") {

       // Otherwise, check if XDomainRequest.
       // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
       xhr = new XDomainRequest();
       xhr.open(method, url);

     } else {

       // Otherwise, CORS is not supported by the browser.
       xhr = null;

     }
     return xhr;
   }
