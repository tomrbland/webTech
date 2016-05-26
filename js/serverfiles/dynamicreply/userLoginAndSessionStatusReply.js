   //Imports
   var USER_LOGIN_AND_SESSION_STATUS_REPLY_EVENT_HANDLER = require("events");

   //Exports
   module.exports = {
      confirmUserLoginAndSessionStatus: function(response, db, userInput) {
         _confirmUserLoginAndSessionStatus(response, db, userInput);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _confirmUserLoginAndSessionStatus(response, db, userInput) {
      var eventEmitter = new USER_LOGIN_AND_SESSION_STATUS_REPLY_EVENT_HANDLER.EventEmitter();

      confirmLoginStatus(db, userInput, eventEmitter);

      eventEmitter.on("Error", reply.bind(null, response, "Not logged in"));
      eventEmitter.on("Logged in user exists", checkUserSessionIDStatus.bind(null, db, userInput, eventEmitter));
      eventEmitter.on("Success: Delete Logged_In row with timed out Session ID - Finalized", reply.bind(null, response, "Logged in, but user session ID timed out"));
      eventEmitter.on("Logged in, valid user session ID", reply.bind(null, response, "Logged in, valid user session ID"));
   }

   function confirmLoginStatus(db, userInput, eventEmitter) {
      db.serialize(prepareLoginStatusQuery.bind(null, db, userInput, eventEmitter));
   }

   function prepareLoginStatusQuery(db, userInput, eventEmitter) {
      var ps = db.prepare("SELECT * FROM Logged_In WHERE sessionID = ? AND personID = (SELECT id FROM Person WHERE username = ?);", errorHandle.bind(null, "Login Status - Prepared statement", eventEmitter));
      eventEmitter.on("Success: Login Status - Prepared statement", getLoginStatusQueryResults.bind(null, ps, userInput, eventEmitter));
   }

   function getLoginStatusQueryResults(ps, userInput, eventEmitter) {
      ps.get(userInput.userSessionID, userInput.username, queryResult.bind(null, eventEmitter));
      ps.finalize(errorHandle.bind(null, "Login Status - Finalized", eventEmitter));
   }

   function queryResult(eventEmitter, error, row) {
      if (row) {
         eventEmitter.emit("Logged in user exists", row.timestamp)
      }
      else {
         eventEmitter.emit("Error", error);
      }
   }

   function checkUserSessionIDStatus(db, userInput, eventEmitter, timestamp) {
      // We credit the top answer in this thread for the following code:
      // http://stackoverflow.com/questions/3075577/convert-mysql-datetime-stamp-into-javascripts-date-format

      // Split timestamp into [ Y, M, D, h, m, s ]
      var t = timestamp.split(/[- :]/);

      var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

      var userSessionIDUnixTimestamp = Date.parse(d)/1000;

      var d = new Date();
      var currentDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
      var currentUnixTimestamp = Date.parse(currentDate)/1000;

      if (userSessionIDUnixTimestamp < (currentUnixTimestamp - 24 * 60 * 60)) {
         //userSessionIDUnixTimestamp is older than 24hrs
         db.serialize(prepareSessionIDDeletion.bind(null, db, userInput, timestamp, eventEmitter));
      }
      else {
         //userSessionIDUnixTimestamp is NOT older than 24hrs
         eventEmitter.emit("Logged in, valid user session ID");
      }
   }

   function prepareSessionIDDeletion(db, userInput, timestamp, eventEmitter) {
      var ps = db.prepare("DELETE FROM Logged_In WHERE sessionID = ? AND personID = (SELECT id FROM Person WHERE username = ?) AND timestamp = ?;", errorHandle.bind(null, "Delete Logged_In row with timed out Session ID - Prepared statement", eventEmitter));
      eventEmitter.on("Success: Delete Logged_In row with timed out Session ID - Prepared statement", runSessionIDDeletion.bind(null, ps, userInput, timestamp, eventEmitter));
   }

   function runSessionIDDeletion(ps, userInput, timestamp, eventEmitter) {
      ps.run(userInput.userSessionID, userInput.username, timestamp, errorHandle.bind(null, "Delete Logged_In row with timed out Session ID - Run statement", eventEmitter));
      eventEmitter.on("Success: Delete Logged_In row with timed out Session ID - Run statement", finalizeSessionIDDeletion.bind(null, ps, eventEmitter));
   }

   function finalizeSessionIDDeletion(ps, eventEmitter) {
      ps.finalize(errorHandle.bind(null, "Delete Logged_In row with timed out Session ID - Finalized", eventEmitter));
   }

   function errorHandle(message, eventEmitter, error) {
      if (error) {
         eventEmitter.emit("Error");
      }
      else {
         eventEmitter.emit("Success: ".concat(message));
      }
   }

   function reply(response, status) {
      var typeHeader = { "Content-Type": "text/plain" };
      response.writeHead(OK, typeHeader);
      response.write(status);
      response.end();
   }
