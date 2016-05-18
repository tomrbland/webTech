"use strict";

if (addEventListener) {
   addEventListener("load", queryDB);
}
else {
   attachEvent("onload", queryDB);
}

function queryDB() {
   var sql = require("sqlite3");
   sql.verbose();
   var db = new sql.Database("test.db");
   db.serialize(query);
}

function query() {
  db.each("SELECT * FROM Review", function(err, row) {
    console.log(row);
  });
  db.close();
}

/*
var fileSystem = require("fs");
fileSystem.writeFile("weatherdata.json", jsonWeatherData, function(err) {
   if(err) {
      return console.log(err);
   }
console.log("The file was saved!"); });
*/

function err(e) {
   if (e) {
      throw e;
   }
}
