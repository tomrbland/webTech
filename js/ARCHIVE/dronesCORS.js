   "use strict";

   addEventListener("load", start);

   var url = "http://api.dronestre.am/data";
   var request = new XMLHttpRequest(true, true);

   request.onreadystatechange = drones;

   // replace url with "js/test.json" to see it working with the test file
   // true == asynchronous processing
   request.open("GET", url, true);
   request.send(null);


//FUNCTIONS--------------------------------

   function start()
   {
      printArea("Test");
   }

   function printArea(s)
   {
      var pelement = document.createElement("p");
      var textnode = document.createTextNode(s);
      pelement.appendChild(textnode);
      document.getElementById("test").appendChild(pelement);
   }

   function drones()
   {
      if(request.status === 200){
         printResponse("Response OK");
      }
      else{
         printResponse("Response Not 200. is: " + request.status);
      }
   }

   function printResponse(s)
   {
      var pelement = document.createElement("p");
      var textnode = document.createTextNode(s);
      pelement.appendChild(textnode);
      document.getElementById("responseCheck").appendChild(pelement);
   }
