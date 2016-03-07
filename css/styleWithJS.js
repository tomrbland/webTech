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

   var sumHeight = getHeight(header) + getHeight(nav) + getHeight(resort);
   var setHeight = winHeight - sumHeight;

   reorderDivs(winWidth);

   responsive.style.height = setHeight + 'px';

   function getHeight(o){
      var ptop = parseInt(window.getComputedStyle(o, null).getPropertyValue("padding-top"), 10);
      var pbottom = parseInt(window.getComputedStyle(o,null).getPropertyValue("padding-bottom"),10);
      var mtop = parseInt(window.getComputedStyle(o,null).getPropertyValue("margin-top"),10);
      var mbottom = parseInt(window.getComputedStyle(o,null).getPropertyValue("margin-bottom"),10);
      var height = parseInt(window.getComputedStyle(o, null).getPropertyValue('height'), 10);
      return ptop + pbottom + mtop + mbottom + height;
   }
   function reorderDivs(width){
      var photos = document.querySelector('#photos');
      var weather = document.querySelector('#weather');
      var map = document.querySelector('#map');
      var reviews = document.querySelector('#reviews');
      var parent = reviews.parentNode;

      parent.removeChild(reviews);
      parent.removeChild(map);

      if(window.innerWidth > 480){
         console.log("styleWithJS.js: Div order reviews, map");
         parent.appendChild(reviews);
         parent.appendChild(map);

         photos.style.float = "left";
         weather.style.float = "right";
         map.style.float = "right";
         reviews.style.float = "left";

         photos.style.clear = "left";
         weather.style.clear = "right";
         map.style.clear = "right";
         reviews.style.clear = "left";

         photos.style.width = "65%";
         weather.style.width = "35%";
         map.style.width = "35%";
         reviews.style.width = "65%";

         reviews.style.overflowY = "scroll";
      }
      else{
         console.log("styleWithJS.js: Div order map, reviews");
         parent.appendChild(map);
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
