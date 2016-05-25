   //Imports
   var LOGIN_ACTION_EVENT_HANDLING = require("events");
   var FS = require("fs");
   var CRYPTO = require("crypto");


   //Exports
   module.exports = {
      executeAction: function(response, url, db, userInput) {
         _executeAction(response, url, db, userInput);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   //does it need the url?
   //1. search db for username and password,
   //2. if there return status 200, username and newly created uid
   //3. if not there return status 500 with blanks

   function _executeAction(response, url, db, userInput) {
      console.log("loginAction.js - entered.");

      var eventEmitter = new LOGIN_ACTION_EVENT_HANDLING.EventEmitter();

      attemptUserLogin(response, url, db, userInput, eventEmitter);

      eventEmitter.on("Error", failureStatusReply.bind(null, response, url, userInput));
      //eventEmitter.on("Success: Insert New User - Finalized", createUserSessionID.bind(null, db, eventEmitter));
      //eventEmitter.on("Success: Insert New Session ID - Finalized", successStatusReply.bind(null, response, url, userInput));
   }

   function attemptUserLogin(response, url, db, userInput, eventEmitter) {
      console.log("attemptUserLogin");
      db.serialize(prepareLoginQuery.bind(null, response, url, db, userInput, eventEmitter));
   }

   function prepareLoginQuery(response, url, db, userInput, eventEmitter) {
      console.log("Login - Prepared statement");
      var ps = db.prepare("SELECT * FROM PERSON WHERE username = ? AND password = ?;", errorHandle.bind(null, "Login - Prepared statement", eventEmitter));
      eventEmitter.on("Success: Login - Prepared statement", getLoginQueryResults.bind(null, response, url, db, ps, userInput, eventEmitter));
   }

   function getLoginQueryResults(response, url, db, ps, userInput, eventEmitter) {
      console.log("Login - Get statement");
      ps.get(userInput.username, userInput.password, setReply.bind(null, response, url));
      ps.finalize(errorHandle.bind(null, "Login - Finalized", eventEmitter));
   }

   function setReply(response, url, error, row) {
      console.log("in setReply");
      if (row) {
         console.log("SUCCESS: " + JSON.stringify(row));
         successStatusReply(response, url, row);

      }
      else {
         console.log("ERROR: " + error);
         failureStatusReply(response, url, error);
      }
   }

   function finalizeLoginQuery(db, ps, userInput, eventEmitter) {
      console.log("Login - Finalized");
      ps.finalize(errorHandle.bind(null, "Login - Finalized", eventEmitter));
   }

   //-------------------------------- CREATE NEW SESSION ID --------------------------------
   /*
   function createUserSessionID(db, eventEmitter, insertedUserID) {
      console.log("\ncreateUserSessionID: ");
      console.log("createUserSessionID. insertedUserID: " + insertedUserID);

      CRYPTO.randomBytes(256, checkValidityOfCrytoRandomBytes.bind(null, "Crypto-secure session ID creation", eventEmitter));
      eventEmitter.on("Success: Crypto-secure session ID creation", attemptSessionIDInsertion.bind(null, db, eventEmitter, insertedUserID))
   }

   function checkValidityOfCrytoRandomBytes(message, eventEmitter, error, buffer) {
      if (error) {
         console.log("Error generating the crypto-secure random bytes.");
         eventEmitter.emit("Error", error);
      }
      else {
         console.log(buffer.length + "bytes of random data: " + buffer.toString("hex"));
         console.log("Success: ".concat(message));
         eventEmitter.emit("Success: ".concat(message), buffer.toString("hex"));
      }
   }

   function attemptSessionIDInsertion(db, eventEmitter, insertedUserID, sessionID) {
      db.serialize(prepareSessionIDInsertion.bind(null, db, eventEmitter, insertedUserID, sessionID));
   }

   function prepareSessionIDInsertion(db, eventEmitter, insertedUserID, sessionID) {
      console.log("Insert New Session ID - Prepared statement");
      var ps = db.prepare("INSERT INTO Logged_In (sessionID, personID) VALUES (?, ?);", errorHandle.bind(null, "Insert New Session ID - Prepared statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New Session ID - Prepared statement", runSessionIDInsertion.bind(null, ps, eventEmitter, insertedUserID, sessionID));
   }

   function runSessionIDInsertion(ps, eventEmitter, insertedUserID, sessionID) {
      console.log("Insert New Session ID - Run statement");
      ps.run(sessionID, insertedUserID, errorHandle.bind(null, "Insert New Session ID - Run statement", eventEmitter, null));
      eventEmitter.on("Success: Insert New Session ID - Run statement", finalizeSessionIDInsertion.bind(null, ps, eventEmitter, sessionID));

   //   function(printID){
   //      console.log("*********printID: " + printID);
   //   });

   //   id.bind(null, "test"));

   //   function id(printID, string){
   //      console.log("*********printID: " + printID);
   //      console.log(string);
   //   }

   }

   function finalizeSessionIDInsertion(ps, eventEmitter, sessionID) {
      console.log("Insert New Session ID - Finalized");
      ps.finalize(errorHandle.bind(null, "Insert New Session ID - Finalized", eventEmitter, sessionID));
   }
   */

   function errorHandle(message, eventEmitter, error) {
      console.log("\n************///------ Entered errorHandle for: " + message);
      if (error) {
         eventEmitter.emit("Error", error);
      }
      else {
         console.log("Success: ".concat(message));
         eventEmitter.emit("Success: ".concat(message));
      }
   }

   function failureStatusReply(response, url, userInput) {
      console.log("failureStatusReply");
      console.log(response + "\n");
      console.log(url + "\n");
      console.log(JSON.stringify(userInput) + "\n");

      var file = "." + url;
      FS.readFile(file, failure.bind(null, response, userInput));
   }

   function failure(response, userInput, err, fileContent) {
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
      fileContent = fileContent.replace('<div class="hidden" id="uid">$</div>', '<div class="hidden" id="uid">' + sessionID + '</div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username">' + userInput.username + '</div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }
