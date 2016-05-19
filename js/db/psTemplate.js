   "use strict";

   //Imports
   var SQL = require("sqlite3"); // SQLite3 API: https://github.com/mapbox/node-sqlite3/wiki/API

   //Exports: N/A

   queryDB();

   function queryDB() {
      SQL.verbose();           //remember to change path if coping and pasting to server
      var db = new SQL.Database("test.db");

      var response = "********* Server response would go here *********";

      var queryWithBoundArgs = query.bind(null, db, response);
      db.serialize(queryWithBoundArgs);
   }

   function query(db, response) {
      console.log("query - Has the response has been passed to query :" + response);
      //OLD: var ps = db.get("SELECT text, count(*) AS count FROM Review", reply.bind(null, responseGoesHere));

      //var errorFunctWithBoundArgs = errorFunct.bind(null, null, "Response goes here");

      //When preparing was successful, the first and only argument to the callback is null,
      //otherwise it is the error object. When bind parameters are supplied, they are bound
      //to the prepared statement before calling the callback.
      var ps = db.prepare("SELECT text FROM Review;", errorHandlePrepare);

      ps.run(/*if user input for ?, put as 1st arg",*/errorHandleRun);

      //The signature of the callback is function(err, rows) {}. If the result set is empty,
      //the second parameter is an empty array, otherwise it contains an object for each result
      //row which in turn contains the values of that row. Like with Statement#run, the statement
      //will not be finalized after executing this function.

      //Note that it first retrieves all result rows and stores them in memory. For queries that
      //have potentially large result sets, use the Database#each function to retrieve all rows or
      //Database#prepare followed by multiple Statement#get calls to retrieve a previously unknown amount of rows.

      var replyWithBoundArgs = reply.bind(null, response);

      ps.all(/*if user input for ?, put as 1st arg",*/replyWithBoundArgs);
      ps.finalize();

      db.close();
   }

   //If an error occurred, the first (and only) parameter will be an error object containing the error message.
   //If execution was successful, the first parameter is null.
   function errorHandlePrepare(error) {
      console.log("\nerrorHandlePrepare - 1st arg (null means successful preparation): " + error);

      if (error) {
         console.log("Error preparing SQL statement: " + error);
         throw error;
      }
      else {
         console.log("errorHandlePrepare - Statement object " + this);
         var statementString = JSON.stringify(this);
         console.log("errorHandlePrepare - Statement object after stringify" + statementString);
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
      console.log("\nerrorHandleRun - 1st arg (null means successful preparation): " + error);

      if (error) {
         console.log("Error running SQL statement: " + error);
         throw error; //I think this is the way to do it? Need to confirm.
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
         console.log("errorHandleRun - Statement object " + this);
         var statementString = JSON.stringify(this);
         console.log("errorHandleRun - Statement object after stringify" + statementString);

         var parsedStatementObject = JSON.parse(statementString);

         if ((parsedStatementObject.lastID === 0) && (parsedStatementObject.changes === 0)) {
            console.log("errorHandleRun - No INSERT or DELETE. This is a SELECT query.");
         }
      }
   }

   function reply(response, err, rows) {
      console.log("\nreply - Reponse: " + response);

      console.log("reply - Rows directly returned from query: " + rows);
      console.log("reply - Rows parsed below: " );

      //http://stackoverflow.com/questions/5533192/how-to-get-object-length
      //COMPATIBILITY ISSUES WITH Object.keys()
      for (var i = 0; i < Object.keys(rows).length; i++) {
         console.log("Row " + i + ": " + rows[i].text);
      }

/*
      var rowString = JSON.stringify(rows);
      console.log("reply - Rows after being stringified: " + rowString);

      var parsedRow = JSON.parse(rowString);
      console.log("reply - rows after parsing: " + parsedRow);

      console.log("reply - rows[0] after parsing: " + parsedRow[0]);
*/
      /*
      var typeHeader = { 'Content-Type': "text/plain" };
      response.writeHead(OK, typeHeader);
      response.write(returnData);
      response.end(); */
   }
