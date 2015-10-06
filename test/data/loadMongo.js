'use strict';

var config = require('../../config');
var mongoose = require('mongoose');
var q = require('q');
var logger = require('../logger');
var mongoLoader = require('../mongoLoader');

logger.level('info');

mongoose.connect.call(mongoose, config.mongo.url);

mongoose.connection.on('connected', function () {

  logger.info('Mongoose connected', config.mongo.url);
  q.all([
    mongoLoader(require('../../modules/surveys/api/Survey'), require('./surveys')),
    mongoLoader(require('../../modules/users/api/User'), require('./users'))
  ]).catch(function (err) {
    logger.error(err);
  }).finally(function () {

    logger.info('Mongoose: closing connection');
    mongoose.disconnect();

  });

});

mongoose.connection.on('error', function (err) {

  logger.error(err, 'Mongoose: error');
  process.exit(1);

});
