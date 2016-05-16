//Imports

//Exports
   module.exports = {
      reply: function(response){
         _reply(response);
      }
   };

//Code
   function _reply(response) {
      var hdrs = { 'Content-Type': 'text/plain' };
      response.writeHead(200, hdrs);  // 200 = OK
      response.write("OK");
      response.end();
   }
