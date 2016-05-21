   //Imports
   var SQL = require("sqlite3");

   //Exports
   module.exports = {
      insertUser: function(userInput){
         _insertUser(userInput);
      }
   };

   var insertResult = "beginning";

   //RUNS THE UNIT TESTS FOR THIS FILE
   test();

   inserttt();

   function insertUser(userInput) {
      var insertResult = inserttt(userInput)

   }

   function inserttt(userInput) {
      SQL.verbose();
      var db = new SQL.Database("../db/resortReport.db");
      db.serialize(insert.bind(null, db, userInput));
   }

   function insert(db, userInput) {
      /**
      * Database#prepare(sql, [param, ...], [callback])
      * When preparing was successful, the first and only argument
      * to the callback is null, otherwise it is the error object.
      */
      var ps = db.prepare("INSERT INTO Persons (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", errorHandle);

      //Statement#run([param, ...], [callback])
      //ps.run(userInput.firstName, userInput.surname, userInput.username, userInput.email, userInput.password, errorHandle);
      ps.run("s", "a", "JamesBond", "007@mi6.co.uk", '007', errorHandle);



      //Close Statement
      ps.finalize();

      //Close db connection
      db.close();
   }

   function errorHandle(error) {
      if (error) {
         insertResult = insertResult.concat(" error1");
         console.log(insertResult);
      }
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
