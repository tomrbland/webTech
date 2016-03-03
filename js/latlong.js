//http://stackoverflow.com/questions/3490622/get-latitude-and-longitude-based-on-location-name-with-google-autocomplete-api

addEventListener('load', buttonOnClick);

function buttonOnClick(){
   var b = document.querySelector('#getCords');
   b.addEventListener('click', codeAddress);
}

function initialize() {
   var address = (document.getElementById('my-address'));
   var autocomplete = new google.maps.places.Autocomplete(address);
   autocomplete.setTypes(['geocode']);
   google.maps.event.addListener(autocomplete, 'place_changed', changeOfPlace);

   function changeOfPlace(){
      var place = autocomplete.getPlace();
      if (!place.geometry) {
         return;
      }
      var address = '';
      if (place.address_components) {
         address = [
           (place.address_components[0] && place.address_components[0].short_name || ''),
           (place.address_components[1] && place.address_components[1].short_name || ''),
           (place.address_components[2] && place.address_components[2].short_name || '')
         ].join(' ');
      }
   }
}


function codeAddress() {
   console.log("Coding Address");
   geocoder = new google.maps.Geocoder();
   var address = document.getElementById("my-address").value;
   geocoder.geocode( { 'address': address}, geo);

   function geo(results, status){
      if (status == google.maps.GeocoderStatus.OK) {
         alert("Latitude: "+results[0].geometry.location.lat());
         alert("Longitude: "+results[0].geometry.location.lng());
      }
      else {
         alert("Geocode was not successful for the following reason: " + status);
      }
   }
}

google.maps.event.addDomListener(window, 'load', initialize);
