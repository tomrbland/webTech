"use strict"

var successfulRequest = 200;
var numOfWeatherBlocks = 3;
var cutoff = 11;
var firstDateDigit = 9;
var conversionInt = 1000;
var twoDigits = 10;

if (addEventListener) {
   addEventListener("load", weather);
}
else {
   attachEvent("onload", weather);
}

function weather() {
   buildWeather();
   displayDates();
   
   var xhr = new XMLHttpRequest();
   xhr.onload = function() {
      if (xhr.status === successfulRequest) {
         console.log("weather.js: Response OK.")
         var responseObject = JSON.parse(xhr.responseText);

         displayWeatherData(responseObject);
      }
   };
   xhr.open("GET", "js/weatherData.json", true);
   xhr.send(null);

   function buildWeather(){
      var container = document.querySelector("#weather");
      for(var i = 0; i < numOfWeatherBlocks; i++){
         var day = newDay(i);
         day.className = "dayblock";
         container.appendChild(day);
      }

      function newDay(number){
         var block = document.createElement("div");
         block.id = "dayblock" + number;
         block.className = "dayblock";

         var day = document.createElement("div");
         day.id = "day" + number;
         day.className = "day";
         block.appendChild(day);

         var icon = document.createElement("canvas");
         icon.id = "icon" + number;
         icon.className = "icon";
         block.appendChild(icon);

         var summary = document.createElement("div");
         summary.id = "summary" + number;
         summary.className = "summary";
         block.appendChild(summary);

         var wind = document.createElement("div");
         wind.id = "wind" + number;
         wind.className = "wind";
         block.appendChild(wind);

         var sunrise = document.createElement("div");
         sunrise.id = "sunrise" + number;
         sunrise.className = "sunrise";
         block.appendChild(sunrise);

         var sunset = document.createElement("div");
         sunset.id = "sunset" + number;
         sunset.className = "sunset";
         block.appendChild(sunset);

         var minTemperature = document.createElement("div");
         minTemperature.id = "minTemperature" + number;
         minTemperature.className = "minTemperature";
         block.appendChild(minTemperature);

         var maxTemperature = document.createElement("div");
         maxTemperature.id = "maxTemperature" + number;
         maxTemperature.className = "maxTemperature";
         block.appendChild(maxTemperature);

         return block;
      }
   }
}

function displayDates() {
   for (var i = 0; i < numOfWeatherBlocks; i++) {
      var date = computeDate(i);
      display(date, "day" + i);
   }
}

function computeDate(i) {
   var d = new Date();
   d.setDate(d.getDate() + i);
   var dateStr = d.toString();
   var formattedDateStr = dateStr.replace(" ", ", ");
   formattedDateStr = formattedDateStr.slice(0, cutoff);
   // Removes leading zeroes from date.
   if (formattedDateStr.charAt(firstDateDigit) == "0") {
      formattedDateStr = formattedDateStr.replace("0", "");
   }
   return formattedDateStr;
}

function displayWeatherData(responseObject) {
   for (var i = 0; i < numOfWeatherBlocks; i ++) {
      displayIcons(responseObject, i);
      displayDailySummaries(responseObject, i);
      displayWindSpeeds(responseObject, i);
      displaySunriseAndSunset(responseObject, i);
      displayTemperatures(responseObject, i);
   }
}

function displayIcons(responseObject, i) {
   switch(responseObject.daily.data[i].icon) {
      case "clear-day":                displayIcon(Skycons.CLEAR_DAY, i);                  break;
      case "clear-night":              displayIcon(Skycons.CLEAR_DAY, i);                  break;
      case "rain":                     displayIcon(Skycons.RAIN, i);                       break;
      case "snow":                     displayIcon(Skycons.SNOW, i);                       break;
      case "sleet":                    displayIcon(Skycons.SLEET, i);                      break;
      case "wind":                     displayIcon(Skycons.WIND, i);                       break;
      case "fog":                      displayIcon(Skycons.FOG, i);                        break;
      case "cloudy":                   displayIcon(Skycons.CLOUDY, i);                     break;
      case "partly-cloudy-day":        displayIcon(Skycons.PARTLY_CLOUDY_DAY, i);          break;
      case "partly-cloudy-night":      displayIcon(Skycons.PARTLY_CLOUDY_DAY, i);          break;
      default:                         displayIcon(Skycons.PARTLY_CLOUDY_DAY, i);
   }
}

function displayIcon(skyconType, i) {
   var skycons = new Skycons();
   skycons.add(document.getElementById("icon" + i), skyconType);
   skycons.play();
}

function displayDailySummaries(responseObject, i) {
   display(responseObject.daily.data[i].summary, "summary" + i);
}

function displayWindSpeeds(responseObject, i) {
   var windSpeed = convertToWholeNum(responseObject.daily.data[i].windSpeed)
   display("Wind: " + windSpeed + "mph", "wind" + i);
}

function displaySunriseAndSunset(responseObject, i) {
   var sunriseTime = convertFromUNIXTimestamp(responseObject.daily.data[i].sunriseTime);
   display("Sunrise: " + sunriseTime, "sunrise" + i);
   var sunsetTime = convertFromUNIXTimestamp(responseObject.daily.data[i].sunsetTime);
   display("Sunset: " + sunsetTime, "sunset" + i);
}

function displayTemperatures(responseObject, i) {
   var minTemp = convertToWholeNum(responseObject.daily.data[i].temperatureMin);
   display(minTemp + "°C", "minTemperature" + i);
   var maxTemp = convertToWholeNum(responseObject.daily.data[i].temperatureMax);
   display(maxTemp + "°C", "maxTemperature" + i);
}

function convertToWholeNum(rationalNum) {
   var rationalNumStr = rationalNum.toString();
   var cutoff = rationalNumStr.indexOf(".");
   var wholeNumStr = rationalNumStr.slice(0, cutoff);
   return wholeNumStr;
}

function convertFromUNIXTimestamp(UNIXTimestamp) {
   var date = new Date(UNIXTimestamp * conversionInt);
   var hours = date.getHours();
   var minutes = date.getMinutes();
   if (minutes < twoDigits) {
      minutes = minutes = "0" + date.getMinutes();
   }
   var time = hours + ":" + minutes;
   return time;
}

function display(str, idOfElement) {
   var pelement = document.createElement("p");
   var textnode = document.createTextNode(str);
   pelement.appendChild(textnode);
   document.getElementById(idOfElement).appendChild(pelement);
}
