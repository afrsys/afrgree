(function () {
  
  'use strict';
  var config = require('./config');
  var logger = require('./core/logFactory').createLogger({ module: 'server' });

  var app = require('./core/app');
  var db = require('./core/db');

  module.exports = {
    run: run,
    logger: logger,
    config: config
  };

  function run() {

    logger.info('Generating routes');
    var router = require('./modules/router');

    logger.info('Starting app');
    var instance = app.create(router);

    logger.info('Connecting to database');
    db.connect()
      .then(function () {
        instance.listen(config.httpPort, function () {
          logger.info({ httpPort: config.httpPort }, 'Server started');
        });
      })
      .catch(function () {
        process.exit(1);
      });

  }

})();

/*var express = require('express');
var fs = require('fs');
var app = express();
var https = require('https');
var config = require('config').api.server;

var options = {
  key: fs.readFileSync(__dirname + './../../config/ssl/afrgree.key.pem'),
  cert: fs.readFileSync(__dirname + './../../config/ssl/afrgree.cert.pem'),
  requestCert: true,
  rejectUnauthorized: false
};

var secureServer = https.createServer(options, app).listen('3030', function () {
  console.log("Secure server listening on port 3030");
});

*/
