
   var data={ "firstName" : "Hi Tom" };
   alert(data.firstName);


   //The beginning of my attemp to parse the JSON data
   var url = "api.dronestre.am/data";

   var xhr = new XMLHttpRequest();

   xhr.onload = function() {
      if (xhr.status === 200) {
         document.write("<p>" + "Response check." + "</p>");
         responseObject = JSON.parse(xhr.responseText);

         // Build up the string with new content
         var newContent = " ";
         for (var i = 0; i < responseObject.strike.length; i++) {
            newContent += "<p>" + responseObject.strike[i].country + "</p>";
            document.write("<p>" + newContent + "</p>");
         }
         /* This is how my book does it but I can't get it to work
            document.getElementById("content").innerHTML = newContent;
         */
      }
   };
                  // url would go here
   xhr.open("GET", "js/test.json", true);
   xhr.send(null);
