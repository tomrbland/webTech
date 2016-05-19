"use strict";

if (addEventListener) {
   addEventListener("load", signin);
}
else {
   attachEvent("onload", signin);
}

function signin(){
   //Do server comms
   redirect();

   function redirect() {
      var url = sessionStorage.getItem("currenturl");
      console.log("Redirect");
      window.location=url;
   }
}
