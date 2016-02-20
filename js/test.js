/*
   var data={ "firstName" : "Hi Tom." };
   alert(data.firstName);
*/
   var today = new Date();
   var hourNow = today.getHours();
   var minNow = today.getMinutes();

   for (i = 0; i < 44; i++) {
      document.write("&nbsp;");
   }

   if ((hourNow < 10) & (minNow < 10)) {
      document.write("The time is 0" + hourNow + ":0" + minNow + "");
   }
   else if (hourNow < 10) {
      document.write("The time is 0" + hourNow + ":" + minNow + "");
   }
   else if (minNow < 10) {
      document.write("The time is " + hourNow + ":0" + minNow + "");
   }
   else {
      document.write("The time is " + hourNow + ":" + minNow + "");
   }
