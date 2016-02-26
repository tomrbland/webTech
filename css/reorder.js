"use strict"

addEventListener('load', reorder);
addEventListener('resize', reorder);

function reorder(){
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
