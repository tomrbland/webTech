"use strict"

addEventListener('load', size);
addEventListener('resize', size);

function size(){
   var winHeight = window.innerHeight;
   var header = document.querySelector('header');
   var nav = document.querySelector('#nav');
   var resort = document.querySelector('#resort');
   var responsive = document.querySelector('#responsive');

   var sumHeight = getHeight(header) + getHeight(nav) + getHeight(resort);
   var setHeight = winHeight - sumHeight;
   //console.log("Should be: " + setHeight);
   responsive.style.height = setHeight + 'px';

   reorderDivs();

   function getHeight(o){
      return parseInt(window.getComputedStyle(o, null).getPropertyValue("height"), 10);
   }
}

function reorderDivs(){
   var width = window.innerWidth;
   var map = document.querySelector('#map');
   var reviews = document.querySelector('#reviews');
   var parent = reviews.parentNode;

   parent.removeChild(reviews);
   parent.removeChild(map);

   if(window.innerWidth > 768){
      parent.appendChild(reviews);
      parent.appendChild(map);
   }
   else{
      parent.appendChild(map);
      parent.appendChild(reviews);
   }
}
