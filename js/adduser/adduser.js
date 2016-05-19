"use strict";

if (addEventListener) {
   addEventListener("load", adduser);
}
else {
   attachEvent("onload", adduser);
}

function adduser(){
   //Do server comms
   redirect();

   function redirect() {
      console.log("Redirect");
      window.location="/index.html";
   }
}
