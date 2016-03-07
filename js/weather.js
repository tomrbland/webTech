// MAGIC NUMBERS !~@/!~@/!~@/!~@/!~@/!~@/!~@/!~@/!~@/!~@/!~@/!~@/!~@/!~@/!~@/

"use strict"
addEventListener("load", weather);

function weather() {
   buildWeather();

   displayDates();
   // NOTE_ TO SELF: REMEMER TO CHECK FOR FLAGS IN CASE DATA UNAVAILABLE
   var xhr = new XMLHttpRequest();
   xhr.onload = function() {
      if (xhr.status === 200) {
         console.log("Response OK.")
         var responseObject = JSON.parse(xhr.responseText);

         displayWeatherData(responseObject);
      }
   };
   xhr.open("GET", "js/weatherData.json", true);
   xhr.send(null);

   function buildWeather(){
      var container = document.querySelector('#weather');
      for(var i = 0; i < 3; i++){
         var day = newDay(i);
         day.className = "dayblock";
         container.appendChild(day);
      }

      function newDay(number){
         var block = document.createElement('div');
         block.id = 'dayblock'+number;
         block.className = 'dayblock';

         var day = document.createElement('div');
         day.id = 'day'+number;
         day.className = 'day';
         block.appendChild(day);

         var icon = document.createElement('canvas');
         icon.id = 'icon'+number;
         icon.className = 'icon';
         /*icon.width = "128";
         icon.height = "50";*/
         block.appendChild(icon);

         var summary = document.createElement('div');
         summary.id = 'summary'+number;
         summary.className = 'summary';
         block.appendChild(summary);

         var wind = document.createElement('div');
         wind.id = 'wind'+number;
         wind.className = 'wind';
         block.appendChild(wind);

         var minTemperature = document.createElement('div');
         minTemperature.id = 'minTemperature'+number;
         minTemperature.className = 'minTemperature';
         block.appendChild(minTemperature);

         var maxTemperature = document.createElement('div');
         maxTemperature.id = 'maxTemperature'+number;
         maxTemperature.className = 'maxTemperature';
         block.appendChild(maxTemperature);

         return block;
      }
   }
}

function displayDates() {
   for (var i = 0; i < 3; i++) {
      var date = computeDate(i);
      display(date, "day" + i);
   }
}

function computeDate (i) {
   var d = new Date();
   d.setDate(d.getDate() + i);
   var dateStr = d.toString();
   var formattedDateStr = dateStr.replace(" ", ", ");
   formattedDateStr = formattedDateStr.slice(0, 11);
   // Removes leading zeroes from date.
   if (formattedDateStr.charAt(9) == '0') {
      formattedDateStr = formattedDateStr.replace("0", "");
   }
   return formattedDateStr;
}

function displayWeatherData(responseObject) {
   for (var i = 0; i < 3; i ++) {
      displayIcons(responseObject, i);
      displayDailySummaries(responseObject, i);
      displayWindSpeeds(responseObject, i);
      displayTemperatures(responseObject, i);
   }
}

function displayIcons(responseObject, i) {
   /*
      icon: A machine-readable text summary of this data point, suitable for selecting
      an icon for display. If defined, this property will have one of the following
      values:
                     clear-day,
                     clear-night,
                     rain,
                     snow,
                     sleet,
                     wind,
                     fog,
                     cloudy,
                     partly-cloudy-day,
                     partly-cloudy-night.

      (Developers should ensure that a
      sensible default is defined, as additional values, such as hail, thunderstorm,
      or tornado, may be defined in the future.)
   */
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

function displayTemperatures(responseObject, i) {
   var minTemp = convertToWholeNum(responseObject.daily.data[i].temperatureMin);
   display(minTemp + "°C", "minTemperature" + i);
   var maxTemp = convertToWholeNum(responseObject.daily.data[i].temperatureMax);
   display(maxTemp + "°C", "maxTemperature" + i);
}

function convertToWholeNum(rationalNum) {
   var rationalNumStr = rationalNum.toString();
   var cutoff = rationalNumStr.indexOf('.');
   var wholeNumStr = rationalNumStr.slice(0, cutoff);
   return wholeNumStr;
}

function display(str, idOfElement) {
   var pelement = document.createElement("p");
   var textnode = document.createTextNode(str);
   pelement.appendChild(textnode);
   document.getElementById(idOfElement).appendChild(pelement);
}
