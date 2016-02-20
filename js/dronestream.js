
   var url = "http://api.dronestre.am/data";

   var xhr = new XMLHttpRequest();

   xhr.onload = function() {
      document.write("<h1>" + "Data Visualisation Experiments" + "</h1>");
      if (xhr.status === 200) {
         document.write("<p>" + "Response check." + "</p>");
         responseObject = JSON.parse(xhr.responseText);

         // Build up the string with new content
         var newContent = "<p>";
         for (var i = 0; i < responseObject.strike.length; i++) {
            // Parses the country of each drone strike event
            newContent += " " + responseObject.strike[i].country + " ";
         }
         newContent += "</p>";
         document.write(newContent);
         /* This is how my book does it but I can't get it to work
            document.getElementById("country").innerHTML = newContent;
         */
      }
      document.write("<p>" + "<a href='index.html'>" + "BACK" + "</a>" + "</p>");
   };

                  // replace url with "js/test.json" to see it working with the test file
                        // true == asynchronous processing
   xhr.open("GET", url, true);
   xhr.send(null);
