   "use strict";

   //Imports
   var SQL = require("sqlite3");

   //Exports
   module.exports = {
      getAllReviewText: function(response){
         _getAllReviewText(response);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _getAllReviewText(response) {
      console.log("Entered _getAllReviewText");
      console.log("response in _getAllReviewText: " + response);

      SQL.verbose();           //remember to change path if coping and pasting to server
      var db = new SQL.Database("js/db/test.db");

      var queryWithBoundArgs = query.bind(null, db, response);
      db.serialize(queryWithBoundArgs);
   }

   function query(db, response) {
      console.log("query - Has the response has been passed to query :" + response);

      var ps = db.prepare("SELECT username, text FROM Review JOIN Person ON Review.personid = Person.id;", errorHandlePrepare);

      ps.run(/*if user input for ?, put as 1st arg",*/errorHandleRun);

      var replyWithBoundArgs = reply.bind(null, response);
      ps.all(/*if user input for ?, put as 1st arg",*/replyWithBoundArgs);

      ps.finalize();

      db.close();
   }

   function errorHandlePrepare(error) {
      console.log("\nerrorHandlePrepare - 1st arg (null means successful preparation): " + error);

      if (error) {
         console.log("Error preparing SQL statement: " + error);
         throw error; //I think this is the way to do it? Need to confirm.
      }
      else {
         console.log("errorHandlePrepare - Statement object " + this);
         var statementString = JSON.stringify(this);
         console.log("errorHandlePrepare - Statement object after stringify" + statementString);
      }
   }

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

   function reply(response, err, rows) {
      console.log("\nreply - Reponse: " + response);

      console.log("reply - Rows directly returned from query: " + rows);
      console.log("reply - Rows after being stringified: " + JSON.stringify(rows));
      console.log("reply - Rows after being parsed: " );

      //http://stackoverflow.com/questions/5533192/how-to-get-object-length
      //COMPATIBILITY ISSUES WITH Object.keys()
      for (var i = 0; i < Object.keys(rows).length; i++) {
         console.log("reply - Row " + i + ": " + rows[i].username + ": " + rows[i].text);
      }

      var typeHeader = { 'Content-Type': "text/plain" };
      response.writeHead(OK, typeHeader);
      response.write(JSON.stringify(rows));
      response.end();
   }
