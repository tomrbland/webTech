   //Imports
   var FS = require("fs");

   //Exports
   module.exports = {
      register: function(response, url, userInputParams){
         _register(response, url, userInputParams);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _register(response, url, userInputParams) {
      console.log("registerAction.js - entered.");
      var file = "." + url;
      FS.readFile(file, deliver.bind(null, response, userInputParams));
   }

   // Deliver the file that has been read in to the browser.
   function deliver(response, userInputParams, err, content) {
      var typeHeader = { 'Content-Type': "text/html" };
      response.writeHead(OK, typeHeader);





      response.write(content);
      response.end();
   }
