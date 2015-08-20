(function () {

  'use strict';

  var q = require('q');
  var mongoose = require('mongoose');
  var logger = require('./logFactory').createLogger({ module: 'db' });
  var config = require('../config');

  module.exports = {
    connect: connect,
    logger: logger
  };

  function connect() {

    var deferred = q.defer();

    var logInfoEvents = [
      'connecting',
      'connected',
      'open',
      'disconnecting',
      'disconnected',
      'close',
      'reconnected',
      'fullsetup'
    ];

    logInfoEvents.forEach(addLogInfo);
    mongoose.connection.once('connected', connected);
    mongoose.connection.on('error', error);

    var databaseUrl = config.databaseUrl;

    if (typeof databaseUrl === 'string') {
      databaseUrl = [config.databaseUrl];
    }

    mongoose.connect.apply(mongoose, databaseUrl);

    return deferred.promise;

    function addLogInfo(eventType) {

      var msg = 'Mongoose ' + eventType;

      mongoose.connection.on(eventType, function () {
        logger.info({ db: config.databaseUrl }, msg);
      });

    }

    function connected() {
      deferred.resolve();
    }

    function error(err) {

      logger.error({ db: config.databaseUrl, err: err }, 'Mongoose error');
      deferred.reject(err);

    }

  }

})();
