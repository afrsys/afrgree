(function () {

  'use strict';
  var logFactory = require('./logFactory');
  var logger = logFactory.createLogger({ module: 'afrgree' });
  var express = require('express');
  var bodyParser = require('body-parser');
  var expressRequestId = require('express-request-id');
  var compression = require('compression');

  module.exports = {
    create: create,
    notFound404Handler: notFound404Handler,
    errorHandler: errorHandler,
    reqLoggerHandler: reqLoggerHandler,
    logger: logger
  };

  function create(apiRouter, app) {

    app = app || express();

    logger.info('Registering compression middleware');
    app.use(compression());

    logger.info('Registering bodyParser middleware');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    logger.info('Registering express-request-id middleware');
    app.use(expressRequestId());

    logger.info('Registering /api with reqLoggerHandler and router');
    app.use('/api', reqLoggerHandler, apiRouter);

    logger.info('Registering / as static content');
    app.use('/', express.static(__dirname + '/../../web'));

    logger.info('Registering 404 handler');
    app.use(module.exports.notFound404Handler);

    logger.info('Registering error handler');
    app.use(module.exports.errorHandler);

    return app;

  }

  function notFound404Handler(req, res, next) {

    logger.warn({ url: req.originalUrl, method: req.method, statusCode: 404 });
    res.status(404).end();

  }

  function errorHandler(err, req, res, next) {

    var logger = req.logger || module.exports.logger;

    logger.error({
      trace: err.stack,
      statusCode: err.statusCode || 500,
      message: err.message
    });
    return res.status(err.statusCode || 500).jsonp({ message: err.message });

  }

  function reqLoggerHandler(req, res, next) {

    req.logger = logFactory.createLogger({
      url: req.originalUrl,
      method: req.method,
      reqId: req.id
    });
    next();

  }

})();
