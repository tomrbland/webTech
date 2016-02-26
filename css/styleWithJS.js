"use strict"

addEventListener('load', size);
addEventListener('resize', size);

function size(){
   var winWidth = window.innerWidth;
   var winHeight = window.innerHeight;
   var header = document.querySelector('header');
   var nav = document.querySelector('#nav');
   var resort = document.querySelector('#resort');
   var responsive = document.querySelector('#responsive');

   var sumHeight = getHeight(header) + getHeight(nav) + getHeight(resort);
   var setHeight = winHeight - sumHeight;
   responsive.style.height = setHeight + 'px';

   reorderDivs(winWidth);

   function getHeight(o){
      return parseInt(window.getComputedStyle(o, null).getPropertyValue("height"), 10);
   }
}

function reorderDivs(width){
   var map = document.querySelector('#map');
   var reviews = document.querySelector('#reviews');
   var parent = reviews.parentNode;

   parent.removeChild(reviews);
   parent.removeChild(map);

   if(window.innerWidth > 480){
      parent.appendChild(reviews);
      parent.appendChild(map);
   }
   else{
      parent.appendChild(map);
      parent.appendChild(reviews);
   }
}
