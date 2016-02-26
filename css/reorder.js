"use strict"

addEventListener('load', reorder);
addEventListener('onresize', reorder);

function reorder(){
   function swapSibling(node1, node2) {
     node1.parentNode.replaceChild(node1, node2); //(new, old)
     node1.parentNode.insertBefore(node2, node1); //(new, referenced)
   }

   if(window.innerWidth > 768){
      swapSibling(document.querySelector('#map'),
                  document.querySelector('#reviews'));
   }
   //console.log(window.innerWidth + " " + document.body.clientWidth);
}
