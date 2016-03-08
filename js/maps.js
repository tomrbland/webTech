"use strict";

var firstMap;
var map;
var mapInitalised = false;
var lat = 45.572252;
var long = 6.829677;
//Reference: https://developers.google.com/maps/documentation/javascript/reference

addEventListener('load', assignLatLong);
google.maps.event.addDomListener(window, 'load', initMap);

function assignLatLong(){
   var data = window.location.search.replace("?", "");
   data = decodeURI(data);
   data = data.split('+').join(' ');
   data = data.split('%2C').join(',');
   var parts = data.split("=");
   var address = parts[1];
   codeAddress(address);
}

function codeAddress(address) {
   console.log("maps.js: Coding Address in to Lat Long");
   var geocoder = new google.maps.Geocoder();
   var address = address;
   geocoder.geocode( { 'address': address}, geo);

   function geo(results, status){
      if (status == google.maps.GeocoderStatus.OK) {
         lat = results[0].geometry.location.lat();
         long = results[0].geometry.location.lng();
         console.log("maps.js: lat: " + lat);
         console.log("maps.js: long: " + long);
      }
      else {
         //addToForm(theForm, 'ERROR', 'There was an Error');
      }
      refreshMap(); //Now need to move pin etc
   }
}

function refreshMap(){
   if(mapInitalised){ //ensure map is init before use;
      console.log("maps.js: refreshMap");

      map = new google.maps.Map(document.querySelector("#map"), {
         center: new google.maps.LatLng(lat,long),
         zoom: 12
      });
      google.maps.event.trigger(map, 'resize');
      addPin(map);
   }
}

function addPin(){
   webcamstravel.easymap.load(map);
   var lesarcs_content = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">'+resortName+'</h1>'+
      '<div id="bodyContent">'+
      '<p><b>'+resortName+'</b>, is here! Let\'s vote!</p>'+
      '</div>'+
      '</div>';

   var infowindow = new google.maps.InfoWindow({content: lesarcs_content});
   var marker = new google.maps.Marker({
                                        position: new google.maps.LatLng(lat,long),
                                        map: map,
                                        title: resortName
                                      });

   marker.addListener('click', function() {
      infowindow.open(map, marker);
   });

   console.log("maps.js: Added Pin and Webcams");
}

function initMap() {
   console.log("maps.js: InitMap - GMAPS CALLBACK");
   var map = new google.maps.Map(document.querySelector("#map"), {
      center: new google.maps.LatLng(lat,long),
      zoom: 12
   });

   mapInitalised = true;
   console.log("maps.js: mapInitalised = True");
}
