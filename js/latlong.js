//http://stackoverflow.com/questions/3490622/get-latitude-and-longitude-based-on-location-name-with-google-autocomplete-api

addEventListener('load', buttonOnClick);
google.maps.event.addDomListener(window, 'load', initialize);


function buttonOnClick(){
   var b = document.querySelector('#getCords');
   //var form = document.forms['resortForm'];
   var form = document.querySelector('#resortForm')
   form.addEventListener('onsubmit', codeAddress);
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
      var theForm = document.forms['resortForm'];

      if (status == google.maps.GeocoderStatus.OK) {
         theForm.appendChild(addToForm('Latitude', results[0].geometry.location.lat()));
         theForm.appendChild(addToForm('Longitude', results[0].geometry.location.lng()));
      }
      else {
         addToForm(theForm, 'ERROR', 'There was an Error');
      }
      theForm.submit();
   }

   function addToForm(key, value){
       // Create a hidden input element
       var input = document.createElement('input');
       input.type = 'hidden';
       input.name = key;'name-as-seen-at-the-server';
       input.value = value;
       return input;
   }
}
