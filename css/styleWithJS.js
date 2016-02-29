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
   resizeMap();
   function getHeight(o){
      var ptop = parseInt(window.getComputedStyle(o, null).getPropertyValue('padding-top'), 10);
      var pbottom = parseInt(window.getComputedStyle(o,null).getPropertyValue("padding-bottom"),10);
      var mtop = parseInt(window.getComputedStyle(o,null).getPropertyValue("margin-top"),10);
      var mbottom = parseInt(window.getComputedStyle(o,null).getPropertyValue("margin-bottom"),10);
      var height = parseInt(window.getComputedStyle(o, null).getPropertyValue('height'), 10);
      return ptop + pbottom + mtop + mbottom + height;
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
