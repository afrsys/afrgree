'use strict';

var info = require('./package.json');

module.exports = {
  app: {
    port: process.env.PORT || 3000
  },
  redis: {
    url: process.env.REDISCLOUD_URL || 'redis://127.0.0.1:6379',
    options: { no_ready_check: true }
  },
  mongo: {
    url: process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/' + info.name
  },
  bunyan: { 
    name: info.name,
    level: process.env.LOG_LEVEL  || 'info'
  }
};
