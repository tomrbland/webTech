   //Imports
   var SQL = require("sqlite3");
   var events = require('events');

   //Exports
   module.exports = {
      insertUser: function(userInput){
         _insertUser(userInput);
      }
   };


   //RUNS THE UNIT TESTS FOR THIS FILE
   test();

   var eventEmitter = new events.EventEmitter();
   var ps, db;

   insertUser();

   var r = end;
   console.log(r);

   function end() {
      return "end";
   }

   eventEmitter.on("SQL Error", errorEvent);
   eventEmitter.on("ps", runQuery);
   eventEmitter.on("run", finish);
   eventEmitter.on("finish", close);
   eventEmitter.on("close", end);

   function errorEvent() {
      console.log("ERROR");
   }

   function insertUser(userInput) {
      go();
   }

   function go(userInput) {
      SQL.verbose();
      db = new SQL.Database("../db/resortReport.db");
      db.serialize(insert.bind(null, db, userInput));
   }

   function insert(db, userInput) {
      ps = db.prepare("INSERT INTO Person (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", function errorHandle(error, string) {
         if (error) {
            console.log(error);
            eventEmitter.emit("SQL Error");
         }
         else {
            eventEmitter.emit("ps");
         }
      });
   }

   function runQuery() {
      console.log("run");
      ps.run("s", "a", "JamejhjhhsBondasd", "007@mi6asdaaaas11sd.co.uk", '007', function errorHandle(error, string) {
         if (error) {
            console.log(error);
            eventEmitter.emit("SQL Error");
         }
         else {
            eventEmitter.emit("run");
         }
      });
   }

   function finish() {
      console.log("finish");
      ps.finalize(function errorHandle(error, string) {
         if (error) {
            console.log(error);
            eventEmitter.emit("SQL Error");
         }
         else {
            eventEmitter.emit("finish");
         }
      });
   }

   function close() {
      db.close(function errorHandle(error, string) {
         if (error) {
            console.log(error);
            eventEmitter.emit("SQL Error");
         }
         else {
            eventEmitter.emit("close");
         }
      });
   }

   function errorHandle(error, string) {
      if (error) {
         console.log(error);
         eventEmitter.emit("SQL Error");
      //   console.log("String in errorHandle for error: " + string);
      }
      else {
         eventEmitter.emit(string);
   //      console.log("String in errorHandle for else: " + string);
      }
   }


/*
   function errorHandleRun(error) {
      console.log("\nerrorHandleRun - 1st arg (null means successful preparation): " + error);

      if (error) {
         console.log("Error running SQL statement: " + error);
         throw error; //I think this is the way to do it? Need to confirm.
      }
      else {
         console.log("errorHandleRun - Statement object " + this);
         var statementString = JSON.stringify(this);
         console.log("errorHandleRun - Statement object after stringify" + statementString);

         var parsedStatementObject = JSON.parse(statementString);

         if ((parsedStatementObject.lastID === 0) && (parsedStatementObject.changes === 0)) {
            console.log("errorHandleRun - No INSERT or DELETE. This is a SELECT query.");
         }
      }
   }
*/

   /**
    * Reply from query

   function reply(response, err, rows) {
      for (var i = 0; i < Object.keys(rows).length; i++) {
      //   console.log("reply - Row " + i + ": " + rows[i].username + ": " + rows[i].title + ": " + rows[i].text);
      }

      var typeHeader = { 'Content-Type': "text/plain" };
      response.writeHead(OK, typeHeader);
      response.write(JSON.stringify(rows));
      response.end();
   }
   */

   function test() {
      //TO DO.
   }
