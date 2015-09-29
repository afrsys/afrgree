'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var expressRequestId = require('express-request-id');
var compression = require('compression');
var passport = require('passport');
var errorcode = require('errorcode');
var errorcodes = {
  'core.missing': 400,
  'core.notFound': 501
};

module.exports = function (modules, redis, mongo, logger) {

  var app = express();

  logger.info('Registering compression middleware');
  app.use(compression());

  logger.info('Registering bodyParser middleware');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  logger.info('Registering express-request-id middleware');
  app.use(expressRequestId());

  logger.info('Registering passport');
  app.use(passport.initialize());

  logger.info('Registering reqLoggerHandler');
  app.use(reqLoggerHandler);

  logger.info('Registering reqRedisHandler');
  app.use(reqRedisHandler);

  logger.info('Registering static files to ./~public');
  app.use('/', express.static('./~public'));

  logger.info('Registering modules');
  app.use(modules);

  logger.info('Registering errorcodes');
  errorcode.register(errorcodes);
  logger.info('Registered errorcodes', errorcode._dictionary);

  logger.info('Registering notFound404Handler');
  app.use(notFound404Handler);

  logger.info('Registering errorHandler');
  app.use(errorHandler);

  return app;

  function notFound404Handler(req, res, next) {

    var mlogger = req.logger || logger;

    mlogger.warn({ url: req.originalUrl, method: req.method, statusCode: 404 });
    res.status(404).end();

  }

  function errorHandler(err, req, res, next) {

    var mlogger = req.logger || logger;
    var message = { message: err.message };
    var status = err.status || errorcode.get(message);

    mlogger.error({
      trace: err.stack,
      status: status,
      message: err.message
    });

    if (process.env.NODE_ENV === 'production') {
      message = null;
    }

    return res.status(status).jsonp(message);

  }

  function reqLoggerHandler(req, res, next) {

    req.logger = logger.child({
      url: req.originalUrl,
      method: req.method,
      reqId: req.id
    });
    next();

  }

  function reqRedisHandler(req, res, next) {

    req.redis = redis;
    next();

  }

};

