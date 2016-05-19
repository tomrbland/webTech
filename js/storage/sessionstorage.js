"use strict";

function store(name, s){
   sessionStorage.setItem(name, s);
}

function get(name){
   return sessionStorage.getItem(name);
}

function remove(name){
   return sessionStorage.removeItem(name);
}
