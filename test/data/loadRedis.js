'use strict';

var redis = require('redis');
var config = require('../../config');

var client = redis.createClient(config.redis.url);

client.on('ready', function () {
  console.log('Redis ready', config.redis.url);

  console.log('Loading data');
  client.set('pagesize', 20);
  client.set('logLevel', 'info');
  client.set('security.tokenLifetime', 604800000);
  client.set('security.hashFactor', 10);

  client.end();
  console.log('Done', config.redis.url);
});
