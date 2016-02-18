var today = new Date();
var hourNow = today.getHours();
var minNow = today.getMinutes();

// can't be bothered with css
document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

if ((hourNow < 10) & (minNow < 10)) {
   document.write("The time is 0" + hourNow + ":0" + minNow + ".");
}
else if (hourNow < 10) {
   document.write("The time is 0" + hourNow + ":" + minNow + ".");
}
else if (minNow < 10) {
   document.write("The time is " + hourNow + ":0" + minNow + ".");
}
else {
   document.write("The time is " + hourNow + ":" + minNow + ".");
}
