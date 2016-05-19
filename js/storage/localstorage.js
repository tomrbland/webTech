"use strict";

function store(name, s){
   localStorage.setItem(name, s);
}

function get(name){
   return localStorage.getItem(name);
}

function remove(name){
   return localStorage.removeItem(name);
}
