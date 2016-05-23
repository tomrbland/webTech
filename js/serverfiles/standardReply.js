   "use strict";

   //Imports
   var FS = require("fs");

   //Exports
   module.exports = {
      reply: function(response, url, type){
         _reply(response, url, type);
      },

      fail: function(response, code, text){
         _fail(response, code, text);
      }
   };

   //Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _reply(response, url, type) {
      var file = "." + url;
      FS.readFile(file, deliver.bind(null, response, type));
   }

   // Deliver the file that has been read in to the browser.
   function deliver(response, type, err, fileContent) {
      if (err) return _fail(response, NotFound, "File not found");
      var typeHeader = { 'Content-Type': type };
      response.writeHead(OK, typeHeader);
      response.write(fileContent);
      response.end();
   }

   // Give a minimal failure response to the browser
   function _fail(response, code, text) {
      var textTypeHeader = { 'Content-Type': 'text/plain' };
      response.writeHead(code, textTypeHeader);
      response.write(text, 'utf8');
      response.end();
   }
