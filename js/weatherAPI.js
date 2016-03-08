"use strict";

var ForecastIo = require("forecastio");

var options = {
  units: "uk2"
};

// The forecast for Les Arcs
var forecastIo = new ForecastIo("885a85ff4be082090e0348da41f005dd");
forecastIo.forecast("45.5717", "6.8078", options).then(function(data) {
   var jsonWeatherData = JSON.stringify(data, null, 2);
   var fileSystem = require("fs");
   fileSystem.writeFile("weatherData.json", jsonWeatherData, function(err) {
      if(err) {
         return console.log(err);
      }
   console.log("The file was saved!"); });
});
