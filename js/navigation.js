"use strict"

addEventListener('load', addNavigation);

function addNavigation(){

   var navBar = document.querySelector('#nav');

   navBar.appendChild(makeDiv('index.html', 'Home'));
   //navBar.appendChild(makeDiv('resort.html', 'Resort Page'));

   function makeDiv(path, text){
      var div = document.createElement('div');
      div.className = 'navButton';

      var a = document.createElement('a');
      a.href = path;
      a.innerHTML = text;

      div.appendChild(a);
      return div;
   }
}
