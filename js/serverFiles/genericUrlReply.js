//Imports

//Exports
   module.exports = {
      reply: function(response, err, content){
         _reply(response, err, content);
      },
      
      fail: function(response, code, message){
         _fail(response, code, message);
      }
   };

//Code
   var OK = 200, NotFound = 404, BadType = 415;

   function _reply(response, err, content) {
     if (err) return fail(response, NotFound, "File not found: " + err);
     var hdrs = { 'Content-Type': 'text/html' };
     response.writeHead(OK, hdrs);
     response.write(content);
     response.end();
   }

   function _fail(response, code, message) {
     var hdrs = { 'Content-Type': 'text/plain' };
     response.writeHead(code, hdrs);
     response.write(message);
     response.end();
   }
