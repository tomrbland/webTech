"use strict"

addEventListener('load', start);
//Should the above be window.addWindowListener('load', start); window. is implicit if you dont mention it

function start()
{
   var newcontent = document.createElement('p');
   newcontent.id = 'tomtest-content';
   newcontent.appendChild(document.createTextNode('HERE IS SOME JS CONTENT'));

   var scr = document.getElementById('tomtest'); //old way of doing things. selectQuery(#id) is the new way uses css selectors
   scr.parentNode.insertBefore(newcontent, scr);
}
