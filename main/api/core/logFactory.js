(function () {

  'use strict';
  var config = require('../config');
  var bunyan = require('bunyan');
  var rootLogger = bunyan.createLogger({
    name: 'afrgree',
    level: config.logLevel
  });

  rootLogger.info('Root logger created');

  module.exports = {
    rootLogger: rootLogger,
    createLogger: createLogger
  };

  function createLogger(opts) {
    return rootLogger.child(opts);
  }

})();
