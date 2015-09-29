'use strict';

var redis = require('redis');

module.exports = function (config, logger) {

  // https://github.com/NodeRedis/node_redis
  var logInfoEvents = [
    'ready',
    'connect',
    'end'
  ];

  var client = redis.createClient(config.url, config.options);

  logInfoEvents.forEach(addLogInfo);
  client.on('error', function (err) {
    logger.error({ config: config }, err);
  });

  return client;

  function addLogInfo (eventType) {

    var msg = 'Redis ' + eventType;

    client.on(eventType, function () {
      logger.info({ config: config }, msg);
    });

  }

};
