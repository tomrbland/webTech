/*
This code sets up the DB

This program only needs to be run once, ever
But it is worth keeping, in case you need to start again

http://blog.modulus.io/nodejs-and-sqlite
*/

"use strict";

var sql = require("sqlite3");
sql.verbose();
var db = new sql.Database("test.db");
db.serialize(startup);

function startup() {
   db.run("DROP TABLE IF EXISTS Review", err);
   db.run("DROP TABLE IF EXISTS Person", err);

   db.run(
      "CREATE TABLE Person (" +
         "id INTEGER PRIMARY KEY, " +
         "username VARCHAR(100) UNIQUE NOT NULL" +
      ")",
   err);

   db.run(
      "CREATE TABLE Review (" +
         "id INTEGER PRIMARY KEY, " +
         "personid INTEGER UNIQUE NOT NULL REFERENCES Person (id), " +
         "text TEXT NOT NULL" +
      ")",
   err);

  db.run("INSERT INTO Person (username) VALUES ('FatherChristmas');", err);
  db.run("INSERT INTO Review (personid, text) VALUES (1, 'Excellent resort. The reindeers also liked it.');", err);
/*
  db.each("SELECT * FROM Review", function(err, row) {
    console.log(row);
  });
*/
  db.close();
}

function err(e) {
   if (e) {
      throw e;
   }
}
