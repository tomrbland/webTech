"use strict";

if (addEventListener) {
   addEventListener("load", loaded);
}
else {
   attachEvent("onload", loaded);
}

function loaded(){
   //server: write uid like this: document.querySelector("#uid").innerHTML = uidFrmServer;
   getStatus();

   function getStatus(){
      var status = document.querySelector("#status").innerHTML;
      if(status === "200"); //change display mode of fail and redirect back to where camefrom.
      else{
         getuid();
         redirect();
      }
   }

   function getuid(){
      var uid = document.querySelector("#uid").innerHTML;
      sessionStorage.setItem("uid", uid);
   }

   function redirect() {
      var url = sessionStorage.getItem("currenturl");
      window.location=url;
   }
}
