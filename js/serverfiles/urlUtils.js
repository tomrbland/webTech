   "use strict";

   /*
    * Utilities for parsing a URL
    * This file contains unit tests
    */

   //Imports
   var FS = require("fs");
   var UTIL = require("./utilities.js");

   //Exports
   module.exports = {
      valid: function (url) {
         return _valid(url);
      },

      safe: function (url) {
         return _safe(url);
      },

      shouldOpen: function (url) {
         return _shouldOpen(url);
      },

      findType: function(url) {
         return _findType(url);
      },

      negotiate: function(accept){
         _negotiate(accept);
      },

      addIndex: function (url) {
          return _addIndex(url);
      },

      removeQuery: function (url){
         return _removeQuery(url);
      }
   };

   //Code
   var banned = defineBanned();
   var types = defineTypes();

   //RUNS THE UNIT TESTS FOR THIS FILE
   test();

   function _valid(url) {
      if (! UTIL.starts(url, "/")) return false;
      if (url.indexOf("//") >= 0) return false;
      if (url.indexOf("/.") >= 0) return false;
      if (UTIL.ends(url, "/")) return true;
      if (url.lastIndexOf(".") < url.lastIndexOf("/")) return false;
      return true;
   }

   function _safe(url){
      var spaceCode = 32, deleteCode = 127;
      if (url.length > 1000) return false;
      for (var i=0; i<url.length; i++) {
        var code = url.charCodeAt(i);
        if (code > spaceCode && code < deleteCode) continue;
        return false;
      }
      return true;
   }

   function _shouldOpen(url){
      for (var i=0; i<banned.length; i++) {
         var ban = banned[i];
         if (url == ban || UTIL.ends(ban, "/") && UTIL.starts(url, ban)) {
            return false;
         }
      }
      return true;
   }

   function _findType(url){
      var dot = url.lastIndexOf(".");
      var extension = url.substring(dot);
      return types[extension];
   }

   // Do content negotiation, assuming all pages on the site are XHTML and
   // suitable for dual delivery.  Check whether the browser claims to accept the
   // XHTML type and, if so, use that instead of the HTML type.
   function _negotiate(accept) {
       var htmlType = "text/html";
       var xhtmlType = "application/xhtml+xml";
       var accepts = accept.split(",");
       if (accepts.indexOf(xhtmlType) >= 0) return xhtmlType;
       else return htmlType;
   }

   // If the url UTIL.ends with / add index.html.
   function _addIndex(url) {
       if (UTIL.ends(url, '/')) url = url + "index.html";
       return url;
   }

   // Remove the query part of a url.
   function _removeQuery(url) {
       var n = url.indexOf('?');
       if (n >= 0) url = url.substring(0, n);
       return url;
   }

   // Avoid delivering the server source file.  Also call banUpperCase.
   function defineBanned() {
       var banned = ["/server.js"];
       banUpperCase(".", banned);
       return banned;
   }

   // Check a folder for files/subfolders with non-lowercase names.  Add them to
   // the banned list so they don't get delivered, making the site case sensitive,
   // so that it can be moved from Windows to Linux, for example. Synchronous I/O
   // is used because this function is only called during startup.  This avoids
   // expensive file system operations during normal execution.  A file with a
   // non-lowercase name added while the server is running will get delivered, but
   // it will be detected and banned when the server is next restarted.
   function banUpperCase(folder, banned) {
       var folderBit = 1 << 14;
       var names = FS.readdirSync(folder);
       for (var i=0; i<names.length; i++) {
           var name = names[i];
           var file = folder + "/" + name;
           if (name != name.toLowerCase()) {
               banned.push(file.substring(1));
           }
           var mode = FS.statSync(file).mode;
           if ((mode & folderBit) == 0) continue;
           banUpperCase(file, banned);
       }
   }

   // The most common standard file extensions are supported.
   // Some common non-standard file extensions are explicitly excluded.
   // This table is defined using a function rather than just a global variable,
   // because otherwise the table would have to appear before calling start().
   function defineTypes() {
       return {
       '.html' : 'text/html',    // old browsers only, see negotiate
       '.css'  : 'text/css',
       '.js'   : 'application/javascript',
       '.png'  : 'image/png',
       '.gif'  : 'image/gif',    // for images copied unchanged
       '.jpeg' : 'image/jpeg',   // for images copied unchanged
       '.jpg'  : 'image/jpeg',   // for images copied unchanged
       '.svg'  : 'image/svg+xml',
       '.json' : 'application/json',
       '.pdf'  : 'application/pdf',
       '.txt'  : 'text/plain',
       '.ttf'  : 'application/x-font-ttf',
       '.woff' : 'application/font-woff',
       '.aac'  : 'audio/aac',
       '.mp3'  : 'audio/mpeg',
       '.mp4'  : 'video/mp4',
       '.webm' : 'video/webm',
       '.ico'  : 'image/x-icon', // just for favicon.ico
       '.xhtml': undefined,      // not suitable for dual delivery, use .html
       '.htm'  : undefined,      // non-standard, use .html
       '.rar'  : undefined,      // non-standard, platform dependent, use .zip
       '.doc'  : undefined,      // non-standard, platform dependent, use .pdf
       '.docx' : undefined,      // non-standard, platform dependent, use .pdf
       }
   }

//------------------------------------------------

// Test the server's logic, and make sure there's an index file.
function test() {
    check(_removeQuery("/index.html?x=1"), "/index.html");
    check(UTIL.lower("/index.html"), "/index.html");
    check(UTIL.lower("/INDEX.HTML"), "/index.html");
    check(_addIndex("/index.html"), "/index.html");
    check(_addIndex("/admin/"), "/admin/index.html");
    check(_valid("/index.html"), true);
    check(_valid("../x"), false, "urls must start with /");
    check(_valid("/x/../y"), false, "urls must not contain /../");
    check(_valid("/x//y"), false, "urls must not contain //");
    check(_valid("/x/./y"), false, "urls must not contain /./");
    check(_valid("/.txt"), false, "urls must not contain /.");
    check(_valid("/x"), false, "filenames must have extensions");
    check(_safe("/index.html"), true);
    check(_safe("/\n/"), false);
    check(_safe("/x y/"), false);
    check(_shouldOpen("/index.html"), true);
    check(_shouldOpen("/server.js"), false);
    check(_findType("/x.txt"), "text/plain");
    check(_findType("/x"), undefined);
    check(_findType("/x.abc"), undefined);
    check(_findType("/x.htm"), undefined);
    check(_findType("x.html"), "text/html");
    check(_negotiate("xxx,text/html"), "text/html");
    check(_negotiate("xxx,application/xhtml+xml"), "application/xhtml+xml");

    check(_negotiate(_findType("x.html")), "text/html");

    check(FS.existsSync('./index.html'), true, "site contains no index.html");
}

function check(x, out, message) {
    if (x == out) return;
    if (message) console.log("Test failed:", message);
    else console.log("Test failed: Expected", out, "Actual:", x);
    console.trace();
    process.exit(1);
}
