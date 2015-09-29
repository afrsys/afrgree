'use strict';

var config = require('../config');

exports.app = function (api, logLevel) {

  process.env.NODE_ENV = 'test';

  var logger = exports.logger(logLevel);
  var mongoServer = exports.mongo(logger);
  var redis = require('../core/redis')(config.redis, logger.child({ core: 'redis' }));

  var router = require('express').Router();
  router.use('/api', api);

  var app = require('../core/app')(router, redis, mongoServer.mongo, logger.child({ core: 'app' }));

  function close () {

    mongoServer.close();
    redis.end();
    as.app = null;
    as.logger = null;

  }

  var as = {
    logger: logger,
    redis: redis,
    app: app,
    close: close
  };

  return as;

};

exports.mongo = function (logger) {

  config.mongo.url = 'mongodb://127.0.0.1/megacondo_test';
  var mongo = require('../core/mongo')(config.mongo, logger.child({ core: 'mongo' }));

  function close () {

    mongo.connection.db.dropDatabase();
    logger.info(config.mongo, 'Database dropped');
    mongo.disconnect();

  }

  var ms = {
    mongo: mongo,
    close: close
  };

  return ms;

};

exports.logger = function (logLevel) {
  return require('bunyan').createLogger({ name: 'testLogger', level: logLevel || 'fatal' });
};
