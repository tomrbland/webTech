

   //1. SELECT * FROM Logged_In WHERE sessionID = ? AND personID = ?
   //2. Get statement
   //3. If not found, return status === 500
   //4. If found but session is stale (older than 24hrs) return status === 500 and sessionID === stale
   //5. If found return status === 200

   function confirmLoginStatus(response, url, db, userInput) {
      console.log("loginStatusReply.js");
   }
