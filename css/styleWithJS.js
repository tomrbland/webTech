"use strict"

addEventListener('load', sizeOnLoad);
addEventListener('resize', sizeOnResize);

function sizeOnLoad(){
   console.log("styleWithJS.js: size - event on load");
   size();
}

function sizeOnResize(){
   console.log("styleWithJS.js: size - event on resize");
   size();
}

function size(){
   var winWidth = window.innerWidth;
   var winHeight = window.innerHeight;

   var header = document.querySelector('header');
   var nav = document.querySelector('#nav');
   var resort = document.querySelector('#resort');
   var responsive = document.querySelector('#responsive');

   reorderDivs(winWidth);

   var sumHeight = getHeight(header) + getHeight(nav) + getHeight(resort);
   var setHeight = winHeight - sumHeight;

   responsive.style.height = setHeight + 'px';

   function get_viewport_size(){
    if(typeof(window.innerWidth) == 'number'){
        my_height = window.innerHeight;
    }else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)){
        my_height = document.documentElement.clientHeight;
    }else if(document.body && (document.body.clientWidth || document.body.clientHeight)){
        my_height = document.body.clientHeight;
    }
    return {my_height};
};

   function getHeight(o){
      /*var ptop = parseInt(window.getComputedStyle(o, null).getPropertyValue("padding-top"), 10);
      var pbottom = parseInt(window.getComputedStyle(o,null).getPropertyValue("padding-bottom"),10);
      var mtop = parseInt(window.getComputedStyle(o,null).getPropertyValue("margin-top"),10);
      var mbottom = parseInt(window.getComputedStyle(o,null).getPropertyValue("margin-bottom"),10);
      var height = parseInt(window.getComputedStyle(o, null).getPropertyValue('height'), 10);*/

      return o.offsetHeight;
      //return ptop + pbottom + mtop + mbottom + height;
   }

   function reorderDivs(width){
      var photos = document.querySelector('#photos');
      var weather = document.querySelector('#weather');
      var map = document.querySelector('#map');
      var reviews = document.querySelector('#reviews');
      var parent = reviews.parentNode;

      parent.removeChild(photos);
      parent.removeChild(weather);
      parent.removeChild(map);
      parent.removeChild(reviews);

      if(window.innerWidth > 768){
         console.log("styleWithJS.js: Div order reviews, photos");
         parent.appendChild(map);
         parent.appendChild(weather);
         parent.appendChild(reviews);
         parent.appendChild(photos);

         photos.style.float = "right";
         weather.style.float = "right";
         map.style.float = "left";
         reviews.style.float = "left";

         photos.style.clear = "right";
         weather.style.clear = "right";
         map.style.clear = "left";
         reviews.style.clear = "left";

         photos.style.width = "35%";
         weather.style.width = "35%";
         map.style.width = "65%";
         reviews.style.width = "65%";

         reviews.style.overflowY = "scroll";
      }
      else{
         console.log("styleWithJS.js: Div order photos, reviews");
         parent.appendChild(weather);
         parent.appendChild(map);
         parent.appendChild(photos);
         parent.appendChild(reviews);

         photos.style.float = "none";
         weather.style.float = "none";
         map.style.float = "none";
         reviews.style.float = "none";

         photos.style.clear = "both";
         weather.style.clear = "both";
         map.style.clear = "both";
         reviews.style.clear = "both";

         photos.style.width = "100%";
         weather.style.width = "100%";
         map.style.width = "100%";
         reviews.style.width = "100%";

         reviews.style.overflowY = "initial";
      }
   }
}
