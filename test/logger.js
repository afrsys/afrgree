'use strict';

var bunyan = require('bunyan');
var logger = bunyan.createLogger({ name: 'testLogger', level: 'fatal' });

module.exports = logger;
