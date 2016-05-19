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
      var url = sessionStorage.getItem("currenturl");
      console.log("Redirect");
      window.location=url;
   }
}
