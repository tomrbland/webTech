/*
JSON.stringify turns a Javascript object into JSON text and stores that JSON text in a string.
JSON.parse turns a string of JSON text into a Javascript object.
*/

/* THIS WORKS
   var ForecastIo = require('forecastio');
   // The forecast for London!
   var forecastIo = new ForecastIo('885a85ff4be082090e0348da41f005dd');
   forecastIo.forecast('51.506', '-0.127').then(function(data) {

   console.log(JSON.stringify(data, null, 2));
   });
*/


/* PARSING EXPERIMENTS... */
   var ForecastIo = require('forecastio');

   // The forecast for Bristol campus!
   var forecastIo = new ForecastIo('885a85ff4be082090e0348da41f005dd');
   forecastIo.forecast('51.457040', '-2.600711').then(function(data) {

      var jsonString = JSON.stringify(data, null, 2);
      //console.log(jsonString);

      var jsObject = JSON.parse(jsonString);
      //console.log(jsObject);

      var newContent;

      console.log(jsObject.daily.summary);
      //console.log(jsObject.currently);
      //console.log(jsObject.minutely.data[2]);
      //console.log(jsObject.alerts);

      for (var i = 0; i < jsObject.hourly.data.length; i++) {
         // Builds a string to print via concatenation.
         newContent += "\n" + jsObject.hourly.data[i].summary;
      }
      //console.log(newContent);
   });



   /*
   printDrones(newContent);

   function printDrones(s)
   {
   var pelement = document.createElement("p");
   var textnode = document.createTextNode(s);
   pelement.appendChild(textnode);
   document.getElementById("responseCheck").appendChild(pelement);
   } */
