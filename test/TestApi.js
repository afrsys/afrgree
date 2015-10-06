'use strict';

var config = require('../config');

module.exports = function (endPoint, api, logger) {

  logger = logger || require('./logger');
  process.env.NODE_ENV = 'test';

  var testMongo = require('./TestMongo')(logger);
  var redis = require('../core/redis')(config.redis, logger.child({ core: 'redis' }));

  var router = require('express').Router();
  router.use(endPoint, api);

  var app = require('../core/app')(
    router,
    redis,
    testMongo.instance,
    logger.child({ core: 'app' }));

  function close () {

    testMongo.close();
    redis.end();
    as.app = null;
    as.logger = null;

  }

  var as = {
    mongo: testMongo.instance,
    redis: redis,
    app: app,
    close: close
  };

  return as;

};




