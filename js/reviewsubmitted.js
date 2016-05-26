   "use strict";

   addEventListener("load", loaded);

   function loaded() {
      var redirectLocation = "/index.html";
      getStatus();

      if(redirectLocation === null) redirectLocation = "/index.html?error=ServerError";
      redirect(redirectLocation);

      function getStatus() {
         var status = document.querySelector("#status").innerHTML;
         console.log("Status: ", status);
         if(status === "200"){
            console.log("Status was 200");
            redirectLocation = sessionStorage.getItem("currenturl");
         }
         else error("fail");
      }

      function redirect(url) {
         setTimeout(doTheRedirect.bind(null, url),2000);
      }

      function doTheRedirect(url) {
         window.location.href=url;
      }

      function error(s) {
         console.log("ERROR: ", s);

         var redirectingMessage = document.querySelector("#Success");
         var failMessage = document.querySelector("#Fail");
         redirectingMessage.style.display = "none";
         failMessage.style.display = "block";
         //redirectLocation = sessionStorage.getItem("formsubmittedfrom")+"?error="+s;
         redirectLocation = sessionStorage.getItem("formsubmittedfrom");
      }
   }
