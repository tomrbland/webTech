"use strict"
var lori = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
addEventListener('load', addReviews);

function addReviews()
{
   for(var i = 0; i< 10; i++){
      var review = document.createElement('div');
      review.className = 'review';

      var h3 = document.createElement('h3');
      h3.innerHTML = i+1 + ") A Review";

      var p = document.createElement('p');
      p.innerHTML = 'THIS IS MY DAMNING REVIEW ' + lori;

      review.appendChild(h3);
      review.appendChild(p);

      var parent = document.querySelector('#reviews');
      parent.appendChild(review);
   }
}
