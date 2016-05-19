   "use strict";

   //Imports
   var SQL = require("sqlite3");

   //Exports: N/A

   queryDB();

   /**
    * Connects to db. Makes connection serial.
    */
   function queryDB() {
      SQL.verbose();
      var db = new SQL.Database("js/db/test.db");

      db.serialize(query.bind(null, db, response));
   }

   /**
    * Prepares the statement. And attaches the reply handler.
    * Closes connection to the db.
    */
   function query(db, responseGoesHere) {
      var ps = db.get("SELECT text, count(*) AS count FROM Review", reply.bind(null, responseGoesHere));
      db.close();
   }

   /**
    * Simply stringifys returnded data.
    */
   function reply(responseGoesHere, err, row){
      console.log("responseGoesHere: " + responseGoesHere);
      console.log("row directly returned from query: " + row);

      var returnData = JSON.stringify(row);
      console.log("row after being stringified: " + returnData);
      /*
      var typeHeader = { 'Content-Type': "text/plain" };
      response.writeHead(OK, typeHeader);
      response.write(returnData);
      response.end(); */
   }
