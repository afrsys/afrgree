'use strict';
var config = require('../config');

exports.start = function () {

  var logger = require('./bunyan')(config.bunyan);
  var redis = require('./redis')(config.redis, logger.child({ core: 'redis' }));
  var mongo = require('./mongo')(config.mongo, logger.child({ core: 'mongo' }));
  var modules = require('../modules')(logger.child({ core: 'modules' }));
  var app = require('./app')(modules, redis, mongo, logger.child({ core: 'app' }));

  app.listen(config.app.port, function () {
    logger.info({ config: config.app, environment: process.env.NODE_ENV }, 'Server started');
  });

};

