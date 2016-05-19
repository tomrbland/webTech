   "use strict";

   //Imports
   var SQL = require("sqlite3");

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

      var ps = db.prepare("SELECT text, count(*) AS count FROM Review", errorFunct);
                                       //[] to make last arg for error callbackFunct, see: https://github.com/mapbox/node-sqlite3/wiki/API
      ps.run(/*user input for 1st arg",*/[], errorFunct)

      //ps.each(ps, reply.bind(null, response));

      ps.finalize();
      db.close();
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

   // Am I handling this correctly?
   function errorFunct(e) {
      if (e) {
         console.log("Error: " + e);
         throw e;
      }
   }
