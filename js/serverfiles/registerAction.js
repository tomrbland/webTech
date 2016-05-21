   //Imports
   var INSERT_USER;
   var FS = require("fs");


   //Exports
   module.exports = {
      executeAction: function(response, url, userInputParams){
         _executeAction(response, url, userInputParams);
      }
   };

   //Final variables
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _executeAction(response, url, userInputParams) {
      console.log("registerAction.js - entered.");

      var insertResult = insertNewUserInDB(response, userInputParams);
      deliverResponse(response, url, userInputParams);
   }

   function insertNewUserInDB() {
      SQL.verbose();
      var db = new SQL.Database("js/db/resortReport.db");
      db.serialize(insert.bind(null, db, response));
   }

   function insert(db, response) {
      /**
      * Database#prepare(sql, [param, ...], [callback])
      * When preparing was successful, the first and only argument
      * to the callback is null, otherwise it is the error object.
      */
      var ps = db.prepare("INSERT INTO Person (firstName, surname, username, email, password) VALUES (?, ?, ?, ?, ?);", errorHandlePrepare);

//WHY do we need .run and .all both execute the statement?
      //Statement#run([param, ...], [callback])
      //ps.run(/*if user input for ?, put as 1st arg",*/errorHandleRun);

      /**
       * Statement#all([param, ...], [callback])
       * Binds parameters, executes the statement and calls the callback with all result rows.
       */
      ps.all(/*if user input for ?, put as 1st arg",*/reply.bind(null, response));

      //Close Statement
      ps.finalize();

      //Close db connection
      db.close();
   }

   /**
    * For catching errors when preparing statment
    */
   function errorHandlePrepare(error) {
   //   console.log("\nerrorHandlePrepare - 1st arg (null means successful preparation): " + error);

      if (error) {
      //   console.log("Error preparing SQL statement: " + error);
         throw error; //I think this is the way to do it? Need to confirm.
      }
      else {
      //   console.log("errorHandlePrepare - Statement object " + this);
         var statementString = JSON.stringify(this);
      //   console.log("errorHandlePrepare - Statement object after stringify" + statementString);
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
    */
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


















   function deliverResponse(response, url, userInputParams) {
      var file = "." + url;
      FS.readFile(file, deliver.bind(null, response, userInputParams));
   }

   // Deliver the file that has been read in to the browser.
   function deliver(response, userInputParams, err, fileContent) {
      var typeHeader = { 'Content-Type': "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">200</div>');
      fileContent = fileContent.replace('<div class="hidden" id="uid">$</div>', '<div class="hidden" id="uid">1</div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username">' + userInputParams.username + '</div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }
