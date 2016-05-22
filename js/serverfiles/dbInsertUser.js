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
   var ps;

   insertUser();

   function insertUser(userInput) {
      insert();
      eventEmitter.on("SQL Error", test);

      function test() {
         console.log("ERROR");
         return "error"
      }
   }

   function insert(userInput) {
      SQL.verbose();
      var db = new SQL.Database("../db/resortReport.db");
      //db.serialize(insert.bind(null, db, userInput));
      ps = db.prepare("INSERT INTO Persons (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", errorHandle.bind("Prepared statement: success"));
      eventEmitter.on("Prepared statement: success", run);
   }

   function run() {
      console.log("run");
      ps.run("s", "a", "JamesBond", "007@mi6.co.uk", '007', errorHandle.bind("Run: success"));
      eventEmitter.on("Run: success", finish.bind(null, ps));
   }

   function finish(ps) {
      console.log("finish");
      ps.finalize();
      db.close();
   }

   function errorHandle(error, string) {
      if (error) {
         console.log(error);
         eventEmitter.emit("SQL Error");
      }
      else {
         eventEmitter.emit(string);
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
