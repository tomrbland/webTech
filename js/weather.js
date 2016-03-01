/*
JSON.stringify turns a Javascript object into JSON text and stores that JSON text in a string.
JSON.parse turns a string of JSON text into a Javascript object.
*/

/* THIS WORKS */
   var ForecastIo = require('forecastio');
   // The forecast for London!
   var forecastIo = new ForecastIo('885a85ff4be082090e0348da41f005dd');
   forecastIo.forecast('51.506', '-0.127').then(function(data) {

   console.log(JSON.stringify(data, null, 2));
   });



/* TRYING TO PARSE...
   var ForecastIo = require('forecastio');

   var jsonString, jsObject;

   // The forecast for London!
   var forecastIo = new ForecastIo('885a85ff4be082090e0348da41f005dd');
   forecastIo.forecast('51.506', '-0.127').then(function(data) {
      // Turns it into a JS object (like in dronestream).
      jsonString = JSON.stringify(data, null, 2);
   });

   jsObject = JSON.parse(jsonString);

   var newContent;
   // Parses the data
   for (var i = 0; i < jsObject.data.length; i++) {
      // Builds a string to print via concatenation.
      newContent += " " + jsObject.data[i] + " ";
   }
   console.log(newContent);
*/


   /*
   printDrones(newContent);

   function printDrones(s)
   {
   var pelement = document.createElement("p");
   var textnode = document.createTextNode(s);
   pelement.appendChild(textnode);
   document.getElementById("responseCheck").appendChild(pelement);
   } */
