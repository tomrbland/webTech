"use strict";

if (addEventListener) {
   addEventListener("load", imageSlider);
}
else {
   attachEvent("onload", imageSlider);
}

addEventListener("focus", start);
addEventListener("blur", stop);

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

   automaticSlide = setInterval(imageLoop, 6000);
   var rightArrow = document.querySelector("#right_arrow");
   rightArrow.addEventListener("click", slideRight);
   var leftArrow = document.querySelector("#left_arrow");
   leftArrow.addEventListener("click",slideLeft);
   sliderInit = true;
}

function start(){
   if(sliderInit) automaticSlide = setInterval(imageLoop, 6000);
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
   fadeEffect = setInterval(fadeOut, 100);
}

function fadeOut() {
   var Image = document.getElementById("img");
   Image.style.opacity = currentOpacity;
   currentOpacity = currentOpacity - 0.1;
   if (currentOpacity <= 0) {
      clearInterval(fadeEffect);
      loadImage(Image, imageCount);
      fadeEffect = setInterval(fadeIn, 100);
      Image.style.opacity = 0;
   }
}

function loadImage(Image, number){
   Image.src = "/images/img" + number + ".jpg";
   var width = parseInt(window.getComputedStyle(Image, null).getPropertyValue("width"), 10);
   var marginLeft = -(width/2);
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
