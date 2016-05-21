   //Imports
   var DB_INSERT_USER = require("./dbInsertUser");
   var FS = require("fs");

   //Exports
   module.exports = {
      executeAction: function(response, url, userInput){
         _executeAction(response, url, userInput);
      }
   };

   //Final variables
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _executeAction(response, url, userInput) {
      console.log("registerAction.js - entered.");

      var insertResult = DB_INSERT_USER.insertUser(userInput);
      
      deliverResponse(response, url, userInput);
   }

   function deliverResponse(response, url, userInput) {
      var file = "." + url;
      FS.readFile(file, deliver.bind(null, response, userInput));
   }

   // Deliver the file that has been read in to the browser.
   function deliver(response, userInput, err, fileContent) {
      var typeHeader = { 'Content-Type': "text/html" };
      response.writeHead(OK, typeHeader);

      fileContent = fileContent.toString();
      fileContent = fileContent.replace('<div class="hidden" id="status">$</div>', '<div class="hidden" id="status">200</div>');
      fileContent = fileContent.replace('<div class="hidden" id="uid">$</div>', '<div class="hidden" id="uid">1</div>');
      fileContent = fileContent.replace('<div class="hidden" id="username">$</div>', '<div class="hidden" id="username">' + userInput.username + '</div>');

      console.log("AFTER replace:\n" + fileContent);

      response.write(fileContent);
      response.end();
   }
