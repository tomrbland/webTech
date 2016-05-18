"use strict";
/**
 *   HTTP server based on Ian's server4
 */

//Imports
   var HTTP = require('https');
   var HANDLER = require('./handle.js');
   var CERT = require('./cert');
   var KEY = require('./key');

//Exports
   module.exports = {
      start: function(port){
         _start(port);
      }
   };

//Code
   //start(8443);

   var cert =
   "-----BEGIN CERTIFICATE-----\n" +
   "MIIC+zCCAeOgAwIBAgIJAK0+qCsR6rThMA0GCSqGSIb3DQEBBQUAMBQxEjAQBgNV\n" +
   "BAMMCWxvY2FsaG9zdDAeFw0xNjA1MTcxMzQxNTlaFw0yNjA1MTUxMzQxNTlaMBQx\n" +
   "EjAQBgNVBAMMCWxvY2FsaG9zdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC\n" +
   "ggEBAKyVncBTugbhT9D0aNZQGgiBRFytk3Wpj4J9CQCRwQJcBnt7ywSqynXkUFs/\n" +
   "fRHYYnM0YBvIjYIe41WRRdswdslK9nefJDAjZ2wutSTwFUItWvueGAeOhl0SaH/H\n" +
   "bpA95Bbz/4SvYkKy8Kq2O/NWz5//4fE36YJqQTZkxc6NvJ0tezxEJ2VyWPoRkoaZ\n" +
   "v4zNOoapw25koMAE99/dc1gglA/0pYCZ1KvirnX6pCdCTe6zYxG6kcZHOBtzGh7k\n" +
   "dGMUlpSy9YK7ho80+2O49ZClOdWw6KPjbtOVXHXONvU82dkBGOGyqtfcalMP/scb\n" +
   "R3LbO3q5UETTqTBAu5OkUqpLrBUCAwEAAaNQME4wHQYDVR0OBBYEFPiGqfBelAbd\n" +
   "EDbEK0Z6kC6UjvZ8MB8GA1UdIwQYMBaAFPiGqfBelAbdEDbEK0Z6kC6UjvZ8MAwG\n" +
   "A1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEFBQADggEBAFf6ccrlyxWgGnrbdQtzqlWG\n" +
   "tPJBZaOBAbOnRXUtx7DhHwspHm0oR1kY8BZNXdDKObrjf3JKv8++GQPRNYJzSAtO\n" +
   "EWjJy5SBGtwnhe0ZO1IknWV4+wLSss+VPhly0EIsmwcQUHehHWIBlj8KrYlD+OTL\n" +
   "jDCO5jxjU/MWCAT7OkT3nw9p77SyYEzmFnBga0QnXy3LdVVyWL34421oxPuOWbUK\n" +
   "f5P93orXs7cO7KylxJlaWPNCl5u5RSloKagriwitl1Di/A5TU3nm5Rb7sg2pbeVo\n" +
   "8XHaneGugPdALk3WlcIDv7OvWsKGQm0cJF6aQ6Bn2Y7svuShH0gTiCGNQk0n7Lg=\n" +
   "-----END CERTIFICATE-----\n";

   var key =
   "-----BEGIN RSA PRIVATE KEY-----\n" +
   "MIIEowIBAAKCAQEArJWdwFO6BuFP0PRo1lAaCIFEXK2TdamPgn0JAJHBAlwGe3vL\n" +
   "BKrKdeRQWz99EdhiczRgG8iNgh7jVZFF2zB2yUr2d58kMCNnbC61JPAVQi1a+54Y\n" +
   "B46GXRJof8dukD3kFvP/hK9iQrLwqrY781bPn//h8TfpgmpBNmTFzo28nS17PEQn\n" +
   "ZXJY+hGShpm/jM06hqnDbmSgwAT3391zWCCUD/SlgJnUq+KudfqkJ0JN7rNjEbqR\n" +
   "xkc4G3MaHuR0YxSWlLL1gruGjzT7Y7j1kKU51bDoo+Nu05Vcdc429TzZ2QEY4bKq\n" +
   "19xqUw/+xxtHcts7erlQRNOpMEC7k6RSqkusFQIDAQABAoIBAAzFncEH8TJlJjT+\n" +
   "gWuqzeJnPpnlNo50l+w+OJZUMwZrrQciaCnWQdlrpg66qhTSAKcp7xrfQqmog4Zn\n" +
   "k9XexkurQoYjvtfZJuQ4qKstIUWeeac5UentQEBPBnC+X45JJkIUmIpHOGxbNbhM\n" +
   "eC9P81mR5DSnwJ4oIt9VodXhY132SpW7ZTXZ2GQKHdzG77qSxsf2gbQ57WmIIFOu\n" +
   "Mx6PISR27iDENcPn6Fk4TpAP87WFwxxKsEo1BI189VfK2SZgdTfTYaqxDjwvM/cx\n" +
   "pi6NGBW0x47SZW3X8ggn3NNfDp4AavZ99fWJRPAwEOcLrWoCZpJBrOS3ROEpqCm/\n" +
   "8yjJckECgYEA1BWfhMk4YzTDcVaYLU9I0hOBXjIGWmaura90mjr2anskfz60Vbu5\n" +
   "6nblIV9n1Q3u40IXCj8ATZX6d7Zn/w0Pm+sXShyM/R68xhRBeKcj1Rx0SsPhCrMc\n" +
   "Kgdp+bAcX6Dlvf6Vf0pi0jvRK/FKXQO70kWEzFjaPrN471lt4t6O6nkCgYEA0FIj\n" +
   "RA/fQ+V58fOvadWBzYtDwUBmNh7FkJzMkRPBj6+fjq3fqV60hd0Ojg6OXtSnwGpO\n" +
   "GFGvfi7TltyZi4vGFSUW/6NEVx+9js9vLlwVeGwgkyDUdMs1UvDFu0B89GjuBBAk\n" +
   "bjElAofwHlzOQJfhn6VN5XHuJEM31wbLqRRw530CgYEAiItLYqByj1yfIE9SNom/\n" +
   "JpGsTssCUB2gBO7bsZiYocGao9npHPF6JzxZFP1pyj/oN6SLVOtu9ITE92IW3py4\n" +
   "GfhnzC1JkIXDn/vWkyl45nIlZSVrtAnQ7jZLwpfiDKd4grRv574qlZQxfYsiB3Sp\n" +
   "7h0X/MCP8qJ2EBORrekANnECgYA3Mpxfi2kYH3S5VF1VSJpVMSJp0TuD+ZFVqQZX\n" +
   "JonyHZHEh3Os+AgTNCiIIXk9zVEJneFFdlduss+juJ4CqK16qtI2ODeCckmSzoni\n" +
   "Gcoil1vmQBurOrDNYjiyTfsN88OlVfWhMOpiikxobyTDXrsMxwsl0ZNNDnZ8RjOu\n" +
   "gFkOLQKBgHo68P7AJrsy7pGtWIORNEaBf7cjJTvaMYmRpPAWYHMicYtwGyK0KKhK\n" +
   "A0YtQICoxjAiGz8Z5HPvt+ynVCR42oVkaOM+iFaAcaSDbr/AkwP4QgcKe3rnYPBB\n" +
   "z55g9NfHVMCZdiF9I2Qo+kp2IQPd0iFCMMr0fgAcl9FFKmqZ+ajq\n" +
   "-----END RSA PRIVATE KEY-----";


   // Provide a service to localhost only.
   function _start(port) {
      console.log("key: ", key, cert);
      var options = { key: key, cert: cert };
      var service = HTTP.createServer(options, HANDLER.handle);
      service.listen(port, 'localhost');
      console.log("Visit https://localhost:" + port);
   }
