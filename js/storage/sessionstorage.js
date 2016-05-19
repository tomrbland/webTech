"use strict";

function store(name, s){
   sessionStorage.setItem(name, s);
}

function get(name, s){
   return sessionStorage.getItem(name);
}
