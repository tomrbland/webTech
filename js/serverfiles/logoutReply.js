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

      eventEmitter.on("Error", reply.bind(null, response, "Logout failed"));
      eventEmitter.on("Success: Logout - Finalized", reply.bind(null, response, "Logout successful"));
   }

   function deleteRowFromLogged_InTable(db, userInput, eventEmitter) {
      console.log("deleteRowFromLogged_InTable");
      db.serialize(prepareLogged_InRowDeletion.bind(null, db, userInput, eventEmitter));
   }

   function prepareLogged_InRowDeletion(db, userInput, eventEmitter) {
      console.log("Logout - Prepared statement");
      console.log("userInput.userSessionID: " + userInput.userSessionID);
      console.log("userInput.username: " + userInput.username);
      var ps = db.prepare("DELETE FROM Logged_In WHERE sessionID = ? AND personID = (SELECT id FROM Person WHERE username = ?);", errorHandle.bind(null, "Logout - Prepared statement", eventEmitter));
      eventEmitter.on("Success: Logout - Prepared statement", runLogged_InRowDeletion.bind(null, ps, userInput, eventEmitter));
   }

   function runLogged_InRowDeletion(ps, userInput, eventEmitter) {
      console.log("Logout - Run statement");
      console.log("userInput.userSessionID: " + userInput.userSessionID);
      console.log("userInput.username: " + userInput.username);
      ps.run(userInput.userSessionID, userInput.username, errorHandle.bind(null, "Logout - Run statement", eventEmitter));
      eventEmitter.on("Success: Logout - Run statement", finalizeLogged_InRowDeletion.bind(null, ps, eventEmitter));
   }

   function finalizeLogged_InRowDeletion(ps, eventEmitter, sessionID) {
      console.log("Logout - Finalized");
      ps.finalize(errorHandle.bind(null, "Logout - Finalized", eventEmitter));
   }

   function errorHandle(message, eventEmitter, error) {
      console.log("\n************///------ Entered errorHandle for: " + message);
      if (error) {
         eventEmitter.emit("Error", error);
      }
      else {
         console.log("this.changes: " + this.changes);
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
