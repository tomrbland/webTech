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
   var request = new XMLHttpRequest();

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
