var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.69, lng: 6.78},
    zoom: 4
  });
}
