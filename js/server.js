   "use strict";

   //Imports
      var httpServer = require('./serverfiles/httpServer.js');

      var httpsServer = require('./serverfiles/httpsServer.js');

   //Code
      httpServer.start(8080);
      httpsServer.start(8443);
