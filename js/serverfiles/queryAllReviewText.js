//Imports
   var SQL = require("sqlite3");

//Exports
   module.exports = {
      getAllReviewText: function(response){
         _getAllReviewText(response);
      }
   };

//Code
   var OK = 200, NotFound = 404, BadType = 415, Error = 500;

   function _getAllReviewText(response) {
      console.log("Entered _getAllReviewText");
      console.log("response in _getAllReviewText: " + response);

      SQL.verbose();
      var db = new SQL.Database("js/db/test.db");

      var queryBind = query.bind(null, db, response)
      db.serialize(queryBind);
   }

   function query(db, response) {
        //only gets 1st row
        var ps = db.get("SELECT * FROM Review", reply.bind(null, response));
        db.close();
   }

   function reply(response, err, row){
     console.log("row directly returned from query: " + row);

     var returnData = JSON.stringify(row);
     console.log("row after being stringified: " + returnData);

     var typeHeader = { 'Content-Type': "text/plain" };
     response.writeHead(OK, typeHeader);
     response.write(returnData);
     response.end();
  }

/*
   function query(one, two, three, four, queryInput, response, db) {
      console.log("1: " + one);
      console.log("2: " + two);
      console.log("3: " + three);
      console.log("4: " + four);
      console.log("queryInput: " + queryInput);
      console.log("reponse: " + response);

      var ps = db.prepare("SELECT * FROM Review WHERE id = ?", errorFunct);
      ps.all(queryInput, show);
      ps.finalize();
      db.close();

      var typeHeader = { 'Content-Type': "text/plain" };
      response.writeHead(OK, typeHeader);

      response.write("************************ HI THERE CLIENT SIDE! ************************");
      response.end();
      console.log("reponse after writing: " + response);
   }

   function errorFunct(err) {
      // to do
   }

   function show(err, row) {
      if (err) throw err;
      console.log("rows " + row);
   }

   function err(e) {
      if (e) {
         throw e;
      }
   }


      function query(queryInput, db, r) {
         console.log(queryInput);
         var ps = db.prepare("SELECT * FROM Review WHERE id = ?", errorFunct);
         //ps.all works with first arg as "1"
         //scope issue with queryInput? it's either [] or undefined here console.log(queryInput);
         console.log("response: " + r);

         ps.all(queryInput, show);
         ps.finalize();
         db.close();

         r.write(data);
         r.end();
      }

      function errorFunct(err) {
         // to do
      }
      function show(err, rows) {
         if (err) throw err;
         console.log("rows " + rows);

         data = rows;
      }

      function err(e) {
         if (e) {
            throw e;
         }
      }
   } */


   /*
         request.on('data', add);
         request.on('end', end);

         var body = "";
         function add(chunk) {
            body = body + chunk.toString();
         }

         function end() {
            var QS = require("querystring");
            console.log(body);
            var params = QS.parse(body);

            console.log("arg received from form: " + params.reviewTextID);
            var queryInput = params.reviewTextID;

            SQL.verbose();
            var db = new SQL.Database("js/db/test.db");
            var queryx = query.bind(null, queryInput, db)
            db.serialize(queryx);

            REPLIER.reply(response, url, type);
         }

         function query(queryInput, db) {
            console.log(queryInput);
            var ps = db.prepare("SELECT * FROM Review WHERE id = ?", errorFunct);
            //ps.all works with first arg as "1"
            //scope issue with queryInput? it's either [] or undefined here console.log(queryInput);
            ps.all(queryInput, show);
            ps.finalize();
            db.close();
         }

         function errorFunct(err) {
            // to do
         }

         function show(err, rows) {
            if (err) throw err;
            console.log(rows);
         }

         function err(e) {
            if (e) {
               throw e;
            }
         }
         */
         /*

         */
