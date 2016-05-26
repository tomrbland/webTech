   "use strict";

   addEventListener("load", didLoginFail);

   function didLoginFail(){
      var submittedFrom = sessionStorage.getItem("formsubmittedfrom");

      var data = window.location.search.replace("?", "");
      data = decodeURI(data);
      data = data.split("+").join(" ");
      data = data.split("%2C").join(",");
      var parts = data.split("=");
      if(parts.length > 1){
         var state = parts[1];
         if(state.indexOf("fail") > -1){
            if(submittedFrom.indexOf("login") > -1)
               alert("Login Failed");
            else alert("Registration failed.\nUsername must be unique.");
         }
      }
   }
