"use strict";

var firstMap;
var map;
var mapInitalised = false;
var lat = 45.572252;
var long = 6.829677;
//Reference: https://developers.google.com/maps/documentation/javascript/reference

function resizeMap(){
   if(mapInitalised){ //ensure map is init before use;
      console.log("maps.js: ResizeMap");

      //This bodge makes sure the map prints full size
      map = new google.maps.Map(document.querySelector("#map"), {
         center: {lat: lat, lng: long},
         zoom: 12
      });
      google.maps.event.trigger(map, 'resize');
      addPin(map);
      map.panTo();
   }
}

function addPin(){
   webcamstravel.easymap.load(map);
   var lesarcs = {lat: lat, lng: long};
   var lesarcs_content = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Les Arcs!</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Les Arcs</b>, is here! Let\'s vote!</p>'+
      '</div>'+
      '</div>';

   var infowindow = new google.maps.InfoWindow({content: lesarcs_content});
   var marker = new google.maps.Marker({
                                        position: lesarcs,
                                        map: map,
                                        title: 'Les Arcs'
                                      });

   marker.addListener('click', function() {
      infowindow.open(map, marker);
   });

   console.log("maps.js: Added Pin and Webcams");
}

function initMap() {
   console.log("maps.js: InitMap - GMAPS CALLBACK");
   var firstMap = new google.maps.Map(document.querySelector("#map"), {
      center: {lat: lat, lng: long},
      zoom: 12
   });
   firstMap.addListener("idle", resizeMap); //Try to get it to risize when everything settled down.
   //addPin(firstMap);

   mapInitalised = true;
   console.log("maps.js: mapInitalised = True");
}
