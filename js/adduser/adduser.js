"use strict";

if (addEventListener) {
   addEventListener("load", adduser);
}
else {
   attachEvent("onload", adduser);
}

function adduser(){
   //Do server comms (get it to give the session UID to store in sessionStorage)
   redirect();

   function redirect() {
      var url = sessionStorage.getItem("currenturl");
      window.location=url;
   }
}
