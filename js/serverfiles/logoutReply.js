   //Imports
   var LOGOUT_REPLY_EVENT_HANDLER = require("events");

   //Exports
   module.exports = {
      completeLogout: function(response, db, userInput) {
         _completeLogout(response, db, userInput);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _completeLogout(response, db, userInput) {
      console.log("deleteRowFromLogged_InTable.js - entered");

      var eventEmitter = new LOGOUT_REPLY_EVENT_HANDLER.EventEmitter();

      deleteRowFromLogged_InTable(db, userInput, eventEmitter);

      eventEmitter.on("Error", reply.bind(null, response, "Logout failed."));

      //eventEmitter.on("Logged in user exists", checkUserSessionIDStatus.bind(null, db, userInput, eventEmitter));
      //eventEmitter.on("Success: Delete Logged_In row with timed out Session ID - Finalized", reply.bind(null, response, "Logged in, but user session ID timed out"));
      //eventEmitter.on("Logged in, valid user session ID", reply.bind(null, response, "Logged in, valid user session ID"));
   }

   function deleteRowFromLogged_InTable(db, userInput, eventEmitter) {
      console.log("deleteRowFromLogged_InTable");
      db.serialize(prepareLogged_InTableDeletion.bind(null, db, userInput, eventEmitter));
   }

   function prepareLogged_InTableDeletion(db, userInput, eventEmitter) {
      console.log("Logout - Prepared statement");
      var ps = db.prepare("DELETE * FROM Logged_In WHERE sessionID = ? AND personID = ?;", errorHandle.bind(null, "Logout - Prepared statement", eventEmitter));
      eventEmitter.on("Success: Logout - Prepared statement", getLoginStatusQueryResults.bind(null, ps, userInput, eventEmitter));
   }

   function getLoginStatusQueryResults(ps, userInput, eventEmitter) {
      console.log("Login Status - Get statement");
      console.log("userInput.userSessionID: " + userInput.userSessionID);
      console.log("userInput.username: " + userInput.username);

      ps.get(userInput.userSessionID, userInput.username, queryResult.bind(null, eventEmitter));
      ps.finalize(errorHandle.bind(null, "Login Status - Finalized", eventEmitter));
   }

   function queryResult(eventEmitter, error, row) {
      console.log("in queryResult");
      if (row) {
         console.log("SUCCESS: " + JSON.stringify(row));
         console.log("SUCCESS: row.timestamp - " + row.timestamp);
         eventEmitter.emit("Logged in user exists", row.timestamp)
      }
      else {
         console.log("ERROR: " + error);
         eventEmitter.emit("Error", error);
      }
   }

   function checkUserSessionIDStatus(db, userInput, eventEmitter, timestamp) {
      console.log("\n checkUserSessionIDStatus: ");
      console.log("checkUserSessionIDStatus. timestamp: \n" + timestamp);

      // We credit the top answer in this thread for the following code:
      // http://stackoverflow.com/questions/3075577/convert-mysql-datetime-stamp-into-javascripts-date-format

      // Split timestamp into [ Y, M, D, h, m, s ]
      var t = timestamp.split(/[- :]/);

      console.log("\n" + t[0]);
      console.log(t[1]);
      console.log(t[2]);
      console.log(t[3]);
      console.log(t[4]);
      console.log(t[5]);

      var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
      console.log("After split and UTC: \n" + d);

      var userSessionIDUnixTimestamp = Date.parse(d)/1000;
      console.log("userSessionIDUnixTimestamp: " + userSessionIDUnixTimestamp);

      var d = new Date();
      var currentDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
      var currentUnixTimestamp = Date.parse(currentDate)/1000;
      console.log("currentUnixTimestamp: " + currentUnixTimestamp);

      if (userSessionIDUnixTimestamp < (currentUnixTimestamp - 24 * 60 * 60)) {
         console.log("userSessionIDUnixTimestamp is older than 24hrs");
         db.serialize(prepareSessionIDDeletion.bind(null, db, userInput, timestamp, eventEmitter));

      }
      else {
         console.log("userSessionIDUnixTimestamp is NOT older than 24hrs");
         eventEmitter.emit("Logged in, valid user session ID");
      }
   }

   //"Logged in, valid user session ID"

   function prepareSessionIDDeletion(db, userInput, timestamp, eventEmitter) {
      console.log("Delete Logged_In row with timed out Session ID - Prepared statement");
      var ps = db.prepare("DELETE FROM Logged_In WHERE sessionID = ? AND personID = (SELECT id FROM Person WHERE username = ?) AND timestamp = ?;", errorHandle.bind(null, "Delete Logged_In row with timed out Session ID - Prepared statement", eventEmitter));
      eventEmitter.on("Success: Delete Logged_In row with timed out Session ID - Prepared statement", runSessionIDDeletion.bind(null, ps, userInput, timestamp, eventEmitter));
   }

   function runSessionIDDeletion(ps, userInput, timestamp, eventEmitter) {
      console.log("Delete Logged_In row with timed out Session ID - Run statement");
      ps.run(userInput.userSessionID, userInput.username, timestamp, errorHandle.bind(null, "Delete Logged_In row with timed out Session ID - Run statement", eventEmitter));
      eventEmitter.on("Success: Delete Logged_In row with timed out Session ID - Run statement", finalizeSessionIDDeletion.bind(null, ps, eventEmitter));
   }

   function finalizeSessionIDDeletion(ps, eventEmitter) {
      console.log("Delete Logged_In row with timed out Session ID - Finalized");
      ps.finalize(errorHandle.bind(null, "Delete Logged_In row with timed out Session ID - Finalized", eventEmitter));
   }

   function errorHandle(message, eventEmitter, error) {
      console.log("\n************///------ Entered errorHandle for: " + message);
      if (error) {
         eventEmitter.emit("Error");
      }
      else {
         console.log("Success: ".concat(message));
         eventEmitter.emit("Success: ".concat(message));
      }
   }

   function reply(response, status) {
      console.log("reply");
      console.log("status: " + status);

      var typeHeader = { 'Content-Type': "text/plain" };
      response.writeHead(OK, typeHeader);
      response.write(status);
      response.end();
   }
