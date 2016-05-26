   //Imports
   var USER_LOGIN_AND_SESSION_STATUS_REPLY_EVENT_HANDLER = require("events");
   var FS = require("fs");

   //Exports
   module.exports = {
      confirmUserLoginAndSessionStatus: function(response, url, db, userInput) {
         _confirmUserLoginAndSessionStatus(response, url, db, userInput);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   //1. SELECT * FROM Logged_In WHERE sessionID = ? AND personID = (SELECT id FROM Person WHERE username = ?);
   //2. Get statement
   //3. If not found, return "Not logged in"
   //4. If found but session is stale (older than 24hrs) return "Logged in, but user session ID timed out"
   //5. If found return "Logged in"

   function _confirmUserLoginAndSessionStatus(response, url, db, userInput) {
      console.log("confirmUserLoginAndSessionStatus.js - entered");

      var eventEmitter = new USER_LOGIN_AND_SESSION_STATUS_REPLY_EVENT_HANDLER.EventEmitter();

      confirmLoginStatus(db, userInput, eventEmitter);

      eventEmitter.on("Error", failureStatusReply.bind(null, response, url));
      eventEmitter.on("Logged in user exists", checkUserSessionIDStatus.bind(null, db, eventEmitter));
      eventEmitter.on("Success: Insert New Session ID - Finalized", successStatusReply.bind(null, response, url, userInput));
   }

   function confirmLoginStatus(db, userInput, eventEmitter) {
      console.log("confirmLoginStatus");
      db.serialize(prepareLoginStatusQuery.bind(null, db, userInput, eventEmitter));
   }

   function prepareLoginStatusQuery(db, userInput, eventEmitter) {
      console.log("Login Status - Prepared statement");
      var ps = db.prepare("SELECT * FROM Logged_In WHERE sessionID = ? AND personID = (SELECT id FROM Person WHERE username = ?);", errorHandle.bind(null, "Login Status - Prepared statement", eventEmitter, null));
      eventEmitter.on("Success: Login Status - Prepared statement", getLoginStatusQueryResults.bind(null, ps, userInput, eventEmitter));
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

   //-------------------------------- CHECK USER SESSION ID STATUS -------------------------------//
   function checkUserSessionIDStatus(db, eventEmitter, timestamp) {
      console.log("\n checkUserSessionIDStatus: ");
      console.log("checkUserSessionIDStatus. timestamp: \n" + timestamp);

      // We credit the top answer in this thread for the following code:
      // http://stackoverflow.com/questions/3075577/convert-mysql-datetime-stamp-into-javascripts-date-format

      // Split timestamp into [ Y, M, D, h, m, s ]
      var t = timestamp.split(/[- :]/);
      console.log("\n");
      console.log(t[0]);
      console.log(t[1]);
      console.log(t[2]);
      console.log(t[3]);
      console.log(t[4]);
      console.log(t[5]);

      //var n = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
      //console.log("After split no UTC: \n" + n);

      // Apply each element to the Date function
      var u = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
      console.log("After split and UTC: \n" + u);

      var unixTimestamp = Date.parse(u)/1000;
      console.log("unixTimestamp: " + unixTimestamp);

      var d = new Date();
      var u2 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
      var currentUnixTimestamp = Date.parse(u2)/1000;
      console.log("currentUnixTimestamp: " + currentUnixTimestamp);

      //eventEmitter.on("Success: Crypto-secure session ID creation", attemptSessionIDInsertion.bind(null, db, eventEmitter, userID))
      /*
      var objToday = new Date(),
                weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
                dayOfWeek = weekday[objToday.getDay()],
                domEnder = new Array( 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th' ),
                dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(("" + objToday.getDate()).substr(("" + objToday.getDate()).length - 1))],
                months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
                curMonth = months[objToday.getMonth()],
                curYear = objToday.getFullYear(),
                curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
                curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
                curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
                curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
      var today = curYear + "-" + curMonth + "-" + dayOfMonth + " " + curHour + ":" + curMinute + ":" + curSeconds + curMeridiem;

      console.log(today);
      */

      //Thu May 26 2016 02:52:28 GMT+0100 (BST)

      var weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
      var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

      var d = new Date();
      var date = d.getDate();
      var day = weekday[d.getDay()];
      var month = months[d.getMonth()];
      var year = d.getFullYear();
      var hour = d.getHours();
      var minutes = d.getMinutes();
      var seconds = d.getSeconds();

      var split = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
      var timeZoneFormatted = split[split.length - 2] + " " + split[split.length - 1];

      console.log("TODAY ACCORDING to getDate methods: \n" + day + " " + month + " " + date + " " + year + " " + hour + ":" + minutes + ":" + seconds + " " + timeZoneFormatted);
   }

   function attemptSessionIDInsertion(db, eventEmitter, userID, sessionID) {
      db.serialize(prepareSessionIDInsertion.bind(null, db, eventEmitter, userID, sessionID));
   }

   function prepareSessionIDInsertion(db, eventEmitter, userID, sessionID) {
      console.log("Insert New Session ID - Prepared statement");
      var ps = db.prepare("INSERT INTO Logged_In (sessionID, personID) VALUES (?, ?);", errorHandle.bind(null, "Insert New Session ID - Prepared statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New Session ID - Prepared statement", runSessionIDInsertion.bind(null, ps, eventEmitter, userID, sessionID));
   }

   function runSessionIDInsertion(ps, eventEmitter, userID, sessionID) {
      console.log("Insert New Session ID - Run statement");
      ps.run(sessionID, userID, errorHandle.bind(null, "Insert New Session ID - Run statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New Session ID - Run statement", finalizeSessionIDInsertion.bind(null, ps, eventEmitter, sessionID));
   }

   function finalizeSessionIDInsertion(ps, eventEmitter, sessionID) {
      console.log("Insert New Session ID - Finalized");
      ps.finalize(errorHandle.bind(null, "Insert New Session ID - Finalized", eventEmitter, sessionID));
   }

   function errorHandle(message, eventEmitter, sessionID, error) {
      console.log("\n************///------ Entered errorHandle for: " + message);
      if (error) {
         eventEmitter.emit("Error");
      }
      else {
         console.log("Success: ".concat(message));
         eventEmitter.emit("Success: ".concat(message), sessionID);
      }
   }

   function failureStatusReply(response, url) {
      console.log("failureStatusReply");
      console.log(response + "\n");
      console.log(url + "\n");

      var file = "." + url;
      FS.readFile(file, failure.bind(null, response));
   }

   function failure(response, err, fileContent) {
      var typeHeader = { 'Content-Type': "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">500</div>');
      fileContent = fileContent.replace('<div class="hidden" id="uid">$</div>', '<div class="hidden" id="uid"></div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username"></div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }

   function successStatusReply(response, url, userInput, sessionID) {
      console.log("\nsuccessStatusReply: ");
      console.log("userInput: " + JSON.stringify(userInput));
      console.log("sessionID: " + sessionID);

      var file = "." + url;
      FS.readFile(file, success.bind(null, response, userInput, sessionID));
   }

   function success(response, userInput, sessionID, err, fileContent) {
      var typeHeader = { 'Content-Type': "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">200</div>');
      fileContent = fileContent.replace('<div class="hidden" id="userSessionID">$</div>', '<div class="hidden" id="userSessionID">' + sessionID + '</div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username">' + userInput.username + '</div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }
