"use strict";

if (addEventListener) {
   addEventListener("load", login);
}
else {
   attachEvent("onload", login);
}

function login(){
   //Do server comms (get it to give the session UID to store in sessionStorage)
   redirect();

   function redirect() {
      var url = sessionStorage.getItem("currenturl");
      window.location=url;
   }
}
