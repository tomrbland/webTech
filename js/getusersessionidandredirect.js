"use strict";

//if (addEventListener) {
//   document.addEventListener("load", loaded);

   addEventListener("load", loaded);

//}
//else {
//   attachEvent("onload", loaded);
//}

//loaded();

function test() {
   console.log("entered r ************************************************************************************************************************************************************************************************************************************************************************************************************************************************");
   window.location.href="https://localhost:8443/";
}

function loaded(){
   console.log("getuidandredirect.js - loaded.");
   var redirectLocation = "/index.html";
   var hasBeenAnError = false;
   if(!hasBeenAnError) getStatus();
   if(!hasBeenAnError) getuid();
   if(!hasBeenAnError) getusername();
   if (redirectLocation === null) {
      redirectLocation = "/index.html?error=ServerError";
   }
   redirect(redirectLocation);

   function getStatus(){
      var status = document.querySelector("#status").innerHTML;
      console.log("Status: ", status);
      if(status === "200") {
         console.log("Status was 200");
         redirectLocation = sessionStorage.getItem("currenturl");
      }
      else {
         error("fail");
      }
   }

   function getuid(){
      var userSessionID = document.querySelector("#userSessionID").innerHTML;
      if (userSessionID === "$") {
         error("ServerError");
      }
      sessionStorage.setItem("userSessionID", userSessionID);
   }

   function getusername(){
      var username = document.querySelector("#username").innerHTML;
      if (username === "$") {
         error("ServerError");
      }
      sessionStorage.setItem("username", username);
   }

   function redirect(url) {
      window.location.href=url;
   }

   function error(s){
      console.log("ERROR: ", s);
      hasBeenAnError = true;
      var redirectingMessage = document.querySelector("#Success");
      var failMessage = document.querySelector("#Fail");
      redirectingMessage.style.display = "none";
      failMessage.style.display = "block";
      redirectLocation = sessionStorage.getItem("formsubmittedfrom")+"?error="+s;
   }
}