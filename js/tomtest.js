var newcontent = document.createElement('p');
newcontent.id = 'tomtest-content';
newcontent.appendChild(document.createTextNode('HERE IS SOME JS CONTENT'));

var scr = document.getElementById('tomtest');
scr.parentNode.insertBefore(newcontent, scr);
