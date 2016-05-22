   //Imports
   var SQL = require("sqlite3");
   var events = require('events');

   //Exports
   module.exports = {
      insertUser: function(userInput){
         _insertUser(userInput);
      }
   };

   var insertRes = 0;

   //RUNS THE UNIT TESTS FOR THIS FILE
   test();

   var eventEmitter = new events.EventEmitter();
   inserttt();


   eventEmitter.on("SQL Error", sqlError);

   function sqlError() {
      console.log("hi error");
   }

   function insertUser(userInput) {
   //   var insertResult = inserttt(userInput)
   }

   function inserttt(userInput) {
      SQL.verbose();
      var db = new SQL.Database("../db/resortReport.db");
      //db.serialize(insert.bind(null, db, userInput));
      console.log("insertRes b4 insert: " + insertRes);
      insert(db, userInput, insertRes);
   }

   function insert(db, userInput, insertRes) {
      /**
      * Database#prepare(sql, [param, ...], [callback])
      * When preparing was successful, the first and only argument
      * to the callback is null, otherwise it is the error object.
      */
      //console.log("before error ps: " + JSON.stringify(db));

      var ps = db.prepare("INSERT INTO Persons (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", function errorHandle(error) {
         if (error) {
            console.log(error);
            insertRes = 2;
            eventEmitter.emit("SQL Error");
         }
      });

      console.log(insertRes);



   //   console.log("ps" + JSON.stringify(ps));
   //   console.log("after error ps: " + JSON.stringify(db));
      //Statement#run([param, ...], [callback])
      //ps.run(userInput.firstName, userInput.surname, userInput.username, userInput.email, userInput.password, errorHandle);
      ps.run("s", "a", "JamesBond", "007@mi6.co.uk", '007', errorHandle);

   //   console.log("after error run: " + JSON.stringify(db));

      //Close Statement
      ps.finalize();

      //Close db connection
      db.close();
   }

   function errorHandle(error) {
      if (error) {
         console.log(error);
      }
   }

   function returnF(thing) {
      insertRes = thing;
      return insertRes;
   }

   /**
    * For catching errors when preparing statment
    */


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
