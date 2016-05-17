"use strict";

if (addEventListener) {
   addEventListener("load", sizeOnLoad);
}
else {
   attachEvent("onload", sizeOnLoad);
}

if (addEventListener) {
   addEventListener("resize", sizeOnResize);
}
else {
   attachEvent("onresize", sizeOnResize);
}

function sizeOnLoad(){
   console.log("stylewithjs.js: size - event on load");
   size();
}

function sizeOnResize(){
   console.log("stylewithjs.js: size - event on resize");
   size();
}

function size(){
   var winWidth = window.innerWidth;
   var winHeight = window.innerHeight;
   var winHeight2 = document.querySelector("html").clientHeight;

   var header = document.querySelector("header");
   var nav = document.querySelector("#nav");
   var resort = document.querySelector("#resort");
   var responsive = document.querySelector("#responsive");

   reorderDivs(winWidth);

   var sumHeight = getHeight(header) + getHeight(nav) + getHeight(resort);
   console.log("stylewithjs.js: winHeight: " + winHeight);
   console.log("stylewithjs.js: sumHeight: " + sumHeight);
   var setHeight = winHeight - sumHeight;

   responsive.style.height = setHeight + "px";

   function getHeight(o){
      return o.offsetHeight;
   }

   function reorderDivs(width){
      var photos = document.querySelector("#photos");
      var weather = document.querySelector("#weather");
      var map = document.querySelector("#map");
      var reviews = document.querySelector("#reviews");
      var parent = reviews.parentNode;

      parent.removeChild(photos);
      parent.removeChild(weather);
      parent.removeChild(map);
      parent.removeChild(reviews);

      if(window.innerWidth > 768){
         console.log("stylewithjs.js: Div order reviews, photos");
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
         console.log("stylewithjs.js: Div order photos, reviews");
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
