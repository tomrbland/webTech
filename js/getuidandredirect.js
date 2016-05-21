"use strict";

if (addEventListener) {
   addEventListener("load", loaded);
}
else {
   attachEvent("onload", loaded);
}

function loaded(){
   var redirectLocation = "/index.html";
   getStatus();
   getuid();
   getusername();
   if(redirectLocation === null) redirectLocation = "/index.html?error=ServerError";
   redirect(redirectLocation);

   function getStatus(){
      var status = document.querySelector("#status").innerHTML;
      console.log("Status: ", status);
      if(status === "200"){
         console.log("Status was 200");
         redirectLocation = sessionStorage.getItem("currenturl");
      }
      else error("fail");
   }

   function getuid(){
      var uid = document.querySelector("#uid").innerHTML;
      if(uid === "$") error("ServerError");
      sessionStorage.setItem("uid", uid);
   }

   function getusername(){
      var username = document.querySelector("#username").innerHTML;
      if(username === "$") error("ServerError");
      sessionStorage.setItem("username", username);
   }

   function redirect(url) {
      window.location.href=url;
   }

   function error(s){
      console.log("ERROR: ", s);

      var redirectingMessage = document.querySelector("#Success");
      var failMessage = document.querySelector("#Fail");
      redirectingMessage.style.display = "none";
      failMessage.style.display = "block";
      redirectLocation = sessionStorage.getItem("formsubmittedfrom")+"?error="+s;
   }
}
