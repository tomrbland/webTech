   "use strict";

   addEventListener("load", sizeOnLoad);

   addEventListener("resize", sizeOnResize);

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
         var reviewsContainer = document.querySelector("#reviewsContainer");
         var parent = reviewsContainer.parentNode;

         parent.removeChild(photos);
         parent.removeChild(weather);
         parent.removeChild(map);
         parent.removeChild(reviewsContainer);

         if(window.innerWidth > 768){
            console.log("stylewithjs.js: Div order reviewsContainer, photos");
            parent.appendChild(map);
            parent.appendChild(weather);
            parent.appendChild(reviewsContainer);
            parent.appendChild(photos);

            photos.style.float = "right";
            weather.style.float = "right";
            map.style.float = "left";
            reviewsContainer.style.float = "left";

            photos.style.clear = "right";
            weather.style.clear = "right";
            map.style.clear = "left";
            reviewsContainer.style.clear = "left";

            photos.style.width = "35%";
            weather.style.width = "35%";
            map.style.width = "65%";
            reviewsContainer.style.width = "65%";

            reviewsContainer.style.overflowY = "scroll";
         }
         else{
            console.log("stylewithjs.js: Div order photos, reviewsContainer");
            parent.appendChild(weather);
            parent.appendChild(map);
            parent.appendChild(photos);
            parent.appendChild(reviewsContainer);

            photos.style.float = "none";
            weather.style.float = "none";
            map.style.float = "none";
            reviewsContainer.style.float = "none";

            photos.style.clear = "both";
            weather.style.clear = "both";
            map.style.clear = "both";
            reviewsContainer.style.clear = "both";

            photos.style.width = "100%";
            weather.style.width = "100%";
            map.style.width = "100%";
            reviewsContainer.style.width = "100%";

            reviewsContainer.style.overflowY = "initial";
         }
      }
   }
