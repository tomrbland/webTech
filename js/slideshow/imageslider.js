"use strict";

var baseTen = 10;
var sixThousandMilliseconds = 6000;
var oneHundredMilliseconds = 100;

if (addEventListener) {
   addEventListener("load", imageSlider);
}
else {
   attachEvent("onload", imageSlider);
}

if (addEventListener) {
   addEventListener("focus", start);
}
else {
   attachEvent("onfocus", start);
}

if (addEventListener) {
   addEventListener("blur", stop);
}
else {
   attachEvent("onblur", stop);
}

var automaticSlide;
var sliderInit = false;
var fading = false;
var imageCount = 0;
var totalImages = 2;
var fadeEffect;
var currentOpacity = 1;

function imageSlider() {
   var Image = document.getElementById("img");
   Image.style.opacity = currentOpacity;
   loadImage(Image, 0);

   automaticSlide = setInterval(imageLoop, sixThousandMilliseconds);
   var rightArrow = document.querySelector("#right_arrow");
   rightArrow.addEventListener("click", slideRight);
   var leftArrow = document.querySelector("#left_arrow");
   leftArrow.addEventListener("click", slideLeft);
   sliderInit = true;
}

function start(){
   if(sliderInit) automaticSlide = setInterval(imageLoop, sixThousandMilliseconds);
}

function stop(){
   if(sliderInit) window.clearInterval(automaticSlide);
}

function imageLoop() {
   slide(1);
}

function slideRight() {
   if(fading){
      clearInterval(fadeEffect);
   }
   stop();
   slide(1);
}

function slideLeft() {
   if(fading){
      clearInterval(fadeEffect);
   }
   stop();
   slide(-1);
}

function slide(i) {
   imageCount += i;
   if (imageCount > totalImages) {
      imageCount = 0;
   }
   else if (imageCount < 0) {
      imageCount = totalImages;
   }
   fading = true;
   fadeEffect = setInterval(fadeOut, oneHundredMilliseconds);
}

function fadeOut() {
   var Image = document.getElementById("img");
   Image.style.opacity = currentOpacity;
   currentOpacity = currentOpacity - 0.1;
   if (currentOpacity <= 0) {
      clearInterval(fadeEffect);
      loadImage(Image, imageCount);
      fadeEffect = setInterval(fadeIn, oneHundredMilliseconds);
      Image.style.opacity = 0;
   }
}

function loadImage(Image, number){
   Image.src = "/images/img" + number + ".jpg";
   var width = parseInt(window.getComputedStyle(Image, null).getPropertyValue("width"), baseTen);
   var marginLeft = - (width / 2);
   Image.setAttribute("style", "margin-left:" + marginLeft.toString() + "px");
}

function fadeIn() {
   var Image = document.getElementById("img");
   Image.style.opacity = currentOpacity;
   currentOpacity = currentOpacity + 0.1;
   if (currentOpacity >= 1) {
      clearInterval(fadeEffect);
      Image.style.opacity = 1;
      currentOpacity = 1;
      fading = false;
   }
}
