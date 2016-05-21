   //Imports
   var FS = require("fs");

   //Exports
   module.exports = {
      register: function(response, url, userInputParams){
         _register(response, url, userInputParams);
      }
   };

   //Final variables
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _register(response, url, userInputParams) {
      console.log("registerAction.js - entered.");
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
/*
      var splitFileContent = fileContent.split("$");
      console.log("After split: " + split);

      var n = splitFileContent.indexOf('<div class="hidden" id="status">,</div>');
      console.log(n);
*/




      response.write(fileContent);
      response.end();
   }
