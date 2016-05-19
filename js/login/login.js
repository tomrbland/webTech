"use strict";

if (addEventListener) {
   addEventListener("load", login);
}
else {
   attachEvent("onload", login);
}

function login(){
   //Do server comms
   redirect();

   function redirect() {
      var url = sessionStorage.getItem("currenturl");
      window.location=url;
   }
}
