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
  db.run("INSERT INTO Person (username) VALUES ('CandideThovex');", err);
  db.run("INSERT INTO Person (username) VALUES ('JamesBond');", err);
  db.run("INSERT INTO Person (username) VALUES ('NoviceSkiier');", err);
  db.run("INSERT INTO Person (username) VALUES ('BoarderDude');", err);

  db.run("INSERT INTO Review (personid, text) VALUES (1, 'Excellent resort. The reindeers also liked it.');", err);
  db.run("INSERT INTO Review (personid, text) VALUES (2, 'I wasn''t really paying attention to the resort - I was too busy jumping over helicopters!');", err);
  db.run("INSERT INTO Review (personid, text) VALUES (3, 'There were too many bad guys chasing me in this resort: 2/10.');", err);
  db.run("INSERT INTO Review (personid, text) VALUES (4, 'I had a great time learning how to ski here.');", err);
  db.run("INSERT INTO Review (personid, text) VALUES (5, 'It had a great halfpipe.');", err);

  db.close();
}

function err(e) {
   if (e) {
      throw e;
   }
}
