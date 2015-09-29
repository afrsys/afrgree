'use strict';

var express = require('express');

module.exports = function (logger) {

  var router = express.Router();

  logger.info('Registering users api');
  router.use('/users/api', require('./users/api'));

  return router;

};
