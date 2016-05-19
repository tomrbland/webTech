   "use strict";

   //Imports
   var SQL = require("sqlite3"); // SQLite3 API: https://github.com/mapbox/node-sqlite3/wiki/API

   //Exports: N/A

   queryDB();

   function queryDB() {
      SQL.verbose();           //remember to change path if coping and pasting to server
      var db = new SQL.Database("test.db");

      var response = "Server response would go here if you wanted to execute this query within serverfiles.";

      var queryWithBoundArgs = query.bind(null, db, response)
      db.serialize(queryWithBoundArgs);
   }

   function query(db, response) {
      //var ps = db.get("SELECT text, count(*) AS count FROM Review", reply.bind(null, responseGoesHere));

      var errorFunctWithBoundArgs = errorFunct.bind(null, null, "Response goes here")

      var ps = db.prepare("SELECT text, count(*) AS count FROM Review", errorFunctWithBoundArgs);

      ps.run(/*if user input for ?, put as 1st arg",*/ errorFunct2)

      //ps.each(ps, reply.bind(null, response));

      ps.finalize();
      db.close();
   }

   // Am I handling this correctly?
   function errorFunct(error, response) {
      console.log("1st arg in errorFunct (null means successful execution): " + error);
      console.log("2nd arg in errorFunct: " + response);

      if (error) {
         console.log("Error preparing SQL statement: " + error);
         throw error;
      }
      else {
         console.log("What's this in errorFunct? " + this);
         var data = JSON.stringify(this);
         console.log("errorFunct data: " + data);
      }
   }

   function errorFunct2(error) {
      console.log("1st arg in errorFunct2 (null means successful execution): " + error);

      if (error) {
         console.log("Error preparing SQL statement: " + error);
         throw error;
      }
      else {
         console.log("What's this in errorFunct2? " + this);
         var data = JSON.stringify(this);
         console.log("errorFunct2 data: " + data);
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
