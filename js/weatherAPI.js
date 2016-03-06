// Needs code to request this every x minutes and for different locations

"use strict"

var ForecastIo = require('forecastio');

var options = {
  units: 'uk2'
};

// The forecast for Les Arcs
var forecastIo = new ForecastIo('885a85ff4be082090e0348da41f005dd');
forecastIo.forecast('45.5717', '6.8078', options).then(function(data) {
   var jsonWeatherData = JSON.stringify(data, null, 2);
   var fileSystem = require('fs');
   fileSystem.writeFile("weatherData.json", jsonWeatherData, function(err) {
      if(err) {
         return console.log(err);
      }
   console.log("The file was saved!"); });
});

/* SECOND ALTERNATIVE WITH NO WRAPPER
var request = require("request");

request("https://api.forecast.io/forecast/885a85ff4be082090e0348da41f005dd/37.8267,-122.423", function(error, response, body) {
console.log(body);
   var fileSystem = require('fs');
   fileSystem.writeFile("weatherData.js", body, function(err) {
      if(err) {
         return console.log(err);
      }
  console.log("The file was saved!"); });
});
*/

/*
"use strict"

var ForecastIo = require('forecastio');

var options = {
  units: 'uk2'
};

// The forecast for Bristol campus!
var forecastIo = new ForecastIo('885a85ff4be082090e0348da41f005dd');
forecastIo.forecast('51.457040', '-2.600711', options).then(function(data) {

   var jsonString = JSON.stringify(data, null, 2);
   //console.log(jsonString);

   var jsObject = JSON.parse(jsonString);
   //console.log(jsObject);

   var weatherData;

   console.log(jsObject.daily.summary);


//   var dayBlock1 = document.querySelector('#dayblock1');
//   var node = getElementById('dayblock1');
//   node.innerHTML = '<p>hi</p>';

   var pelement = document.createElement("p");
   var textnode = document.createTextNode("Response OK");
   pelement.appendChild(textnode);
   document.getElementById("dayblock1").appendChild(pelement);

   //console.log(jsObject.currently);
   //console.log(jsObject.minutely.data[2]);
   //console.log(jsObject.alerts);
   //console.log(jsObject.nearestStormDistance);

//   for (var i = 0; i < jsObject.hourly.data.length; i++) {
      // Builds a string to print via concatenation.
   //   weatherData += "\n" + jsObject.hourly.data[i].summary;
   //   weatherData += "\n" + jsObject.hourly.data[i].windSpeed;
   //}
   //console.log(weatherData);
//   });
*/
