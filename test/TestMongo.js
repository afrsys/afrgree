'use strict';

var config = require('../config');

module.exports = function (logger) {

  logger = logger || require('./logger');
  config.mongo.url = 'mongodb://127.0.0.1/megacondo_test';
  var mongo = require('../core/mongo')(config.mongo, logger.child({ core: 'mongo' }));

  function close () {

    mongo.connection.db.dropDatabase();
    logger.info(config.mongo, 'Database dropped');
    mongo.disconnect();

  }

  var ms = {
    instance: mongo,
    close: close
  };

  return ms;

};
