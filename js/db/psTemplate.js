   "use strict";

   //Imports
   var SQL = require("sqlite3"); // SQLite3 API: https://github.com/mapbox/node-sqlite3/wiki/API

   //Exports: N/A

   queryDB();

   function queryDB() {
      SQL.verbose();           //remember to change path if coping and pasting to server
      var db = new SQL.Database("test.db");

      var response = "********* Server response would go here *********";

      var queryWithBoundArgs = query.bind(null, db, response)
      db.serialize(queryWithBoundArgs);
   }

   function query(db, response) {
      console.log("Has the response has been passed to query :" + response);
      //OLD: var ps = db.get("SELECT text, count(*) AS count FROM Review", reply.bind(null, responseGoesHere));

      //var errorFunctWithBoundArgs = errorFunct.bind(null, null, "Response goes here");

      //When preparing was successful, the first and only argument to the callback is null,
      //otherwise it is the error object. When bind parameters are supplied, they are bound
      //to the prepared statement before calling the callback.
      var ps = db.prepare("SELECT text, count(*) AS count FROM Review", errorHandlePrepare);

      ps.run(/*if user input for ?, put as 1st arg",*/ errorHandleRun);

      //OLD: ps.each(ps, reply.bind(null, response));

      ps.finalize();
      db.close();
   }

   //If an error occurred, the first (and only) parameter will be an error object containing the error message.
   //If execution was successful, the first parameter is null.
   function errorHandlePrepare(error) {
      console.log("errorHandlePrepare - 1st arg (null means successful preparation): " + error);

      if (error) {
         console.log("Error preparing SQL statement: " + error);
         throw error;
      }
      else {
         console.log("errorHandlePrepare - statement object " + this);
         var statementString = JSON.stringify(this);
         console.log("errorHandlePrepare - statement object after stringify" + statementString);
      }
   }


   //Binds parameters and executes the statement. The function returns the Statement object to allow for
   //function chaining.

   //If you specify bind parameters, they will be bound to the statement before it is executed. Note that
   //the bindings and the row cursor are reset when you specify even a single bind parameter.

   //The callback behavior is identical to the Database#run method with the difference that the statement
   //will not be finalized after it is run. This means you can run it multiple times.

   //If an error occurred, the first (and only) parameter will be an error object containing the error message.
   //If execution was successful, the first parameter is null.
   function errorHandleRun(error) {
      console.log("errorHandleRun - 1st arg (null means successful preparation): " + error);
      //console.log("errorHandleRun - 2nd arg " + response);

      if (error) {
         console.log("Error running SQL statement: " + error);
         throw error;
      }
      else {
         /*
         If execution was successful, the this object will contain two properties named
         lastID and changes which contain the value of the last inserted row ID and the
         number of rows affected by this query respectively. Note that lastID only contains
         valid information when the query was a successfully completed INSERT statement and
         changes only contains valid information when the query was a successfully completed
         UPDATE or DELETE statement. In all other cases, the content of these properties is
         inaccurate and should not be used. The .run() function is the only query method that
         sets these two values; all other query methods such as .all() or .get() don't retrieve
         these values.
         */
         console.log("errorHandleRun - statement object " + this);
         var statementString = JSON.stringify(this);
         console.log("errorHandleRun - statement object after stringify" + statementString);

         var parsedStatementObject = JSON.parse(statementString);

         //If the prepared statement that was run didn't INSERT or DELETE and is
         //just a SELECT
         if ((parsedStatementObject.lastID === 0) && (parsedStatementObject.changes === 0)) {
            console.log("errorHandleRun - No INSERT or DELETE. This is a SELECT query.");


         }


      //   this.all(reply.bind(null, response))
      }
   }




   function reply(response, err, row){
      console.log("responseGoesHere: " + response);
      console.log("row directly returned from query: " + row);

      var returnData = JSON.stringify(row);
      console.log("row after being stringified: " + returnData);
      /*
      var typeHeader = { 'Content-Type': "text/plain" };
      response.writeHead(OK, typeHeader);
      response.write(returnData);
      response.end(); */
   }
