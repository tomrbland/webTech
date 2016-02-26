"use strict"

addEventListener('resize', resizeMap);

var map;

//Reference: https://developers.google.com/maps/documentation/javascript/reference

function resizeMap(){
   google.maps.event.trigger(map, 'resize')
}

function initMap() {
   var map = new google.maps.Map(document.querySelector("#map"), {
      center: {lat: 45.69, lng: 6.78},
      zoom: 4
   });

   var lesarcs = {lat: 45.572584, lng: 6.820364};
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

   webcamstravel.easymap.load(map);
}
