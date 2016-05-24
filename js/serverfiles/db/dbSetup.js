   "use strict";

   //Imports
   var SQL = require("sqlite3");

   SQL.verbose();
   var db = new SQL.Database("resortReport.db");
   db.serialize(startup);

   function startup() {
      db.run("DROP TABLE IF EXISTS Review;", errorHandle);
      db.run("DROP TABLE IF EXISTS Logged_In;", errorHandle);
      db.run("DROP TABLE IF EXISTS Person;", errorHandle);

      db.run(
         "CREATE TABLE Person (" +
            "id INTEGER PRIMARY KEY, " +
            "firstName TEXT NOT NULL, " +
            "surname TEXT NOT NULL, " +
            "username TEXT UNIQUE NOT NULL, " +
            "email TEXT UNIQUE NOT NULL, " +
            "password TEXT NOT NULL" +
         ");",
      errorHandle);

      db.run(
         "CREATE TABLE Review (" +
            "id INTEGER PRIMARY KEY, " +
            "personID INTEGER UNIQUE NOT NULL REFERENCES Person (id), " +
            "title TEXT NOT NULL, " +
            "text TEXT NOT NULL" +
         ");",
      errorHandle);

      db.run(
         "CREATE TABLE Logged_In (" +
            "sessionID INTEGER NOT NULL, " +
            "personID INTEGER NOT NULL REFERENCES Person (id), " +
            "timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, " +
            "PRIMARY KEY (sessionID, personID, timestamp)" +
         ");",
      errorHandle);

     db.run("INSERT INTO Person (firstName, surname, username, email, password) VALUES ('Santa', 'Clause', 'FatherChristmas', 'mrchristmas@yahoo.com', 'ilovechristmas');", errorHandle);
     db.run("INSERT INTO Person (firstName, surname, username, email, password) VALUES ('Candide', 'Thovex', 'CandideThovex', 'skistunts777@gmail.com', 'adrenaline');", errorHandle);
     db.run("INSERT INTO Person (firstName, surname, username, email, password) VALUES ('James', 'Bond', 'JamesBond', '007@mi6.co.uk', '007');", errorHandle);
     db.run("INSERT INTO Person (firstName, surname, username, email, password) VALUES ('Beth', 'Smith', 'NoviceSkier', 'beth2517@hotmail.co.uk', 'skiii');", errorHandle);
     db.run("INSERT INTO Person (firstName, surname, username, email, password) VALUES ('Chuck', 'Dennis', 'BoarderDude', 'chucklovessnowboarding@gmail.com', 'password');", errorHandle);

     db.run("INSERT INTO Review (personID, title, text) VALUES (1, 'We all had a merry time.', 'Excellent resort. The reindeers also liked it.');", errorHandle);
     db.run("INSERT INTO Review (personID, title, text) VALUES (2, 'A good location for my stunts.', 'I wasn''t really paying attention to the resort - I was too busy jumping over helicopters!');", errorHandle);
     db.run("INSERT INTO Review (personID, title, text) VALUES (3, 'No matter where I go I seem to make enemies...', 'There were too many bad guys chasing me in this resort: 2/10.');", errorHandle);
     db.run("INSERT INTO Review (personID, title, text) VALUES (4, 'A good resort for novices.', 'I had a great time learning how to ski here.');", errorHandle);
     db.run("INSERT INTO Review (personID, title, text) VALUES (5, 'Rad.', 'It had a sweet halfpipe.');", errorHandle);

     db.close();
   }

   function errorHandle(error) {
      if (error) {
         console.log("ERROR: " + error);
         throw error;
      }
   }
