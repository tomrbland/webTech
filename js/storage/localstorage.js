"use strict";

function store(name, s){
   localStorage.setItem(name, s);
}

function get(name, s){
   return localStorage.getItem(name);
}
