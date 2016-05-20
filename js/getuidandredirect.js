"use strict";

if (addEventListener) {
   addEventListener("load", loaded);
}
else {
   attachEvent("onload", loaded);
}

function loaded(){
   //server: write uid like this: document.querySelector("#uid").innerHTML = uidFrmServer;
   getuid();
   redirect();

   function getuid(){
      var uid = document.querySelector("#uid").innerHTML;
      sessionStorage.setItem("uid", uid);
   }

   function redirect() {
      var url = sessionStorage.getItem("currenturl");
      window.location=url;
   }
}
