(function () {

  'use strict';
  /*jshint expr: true*/
  var expect = require('chai').expect;
  var sinon = require('sinon');
  var express = require('express');
  var request = require('supertest');
  var logFactory = require('./logFactory');
  var app = require('./app');

  describe('app', function () {

    var exp, sandbox;

    beforeEach(function () {

      exp = express();
      sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('notFound404Handler', function () {
      it ('Logs a warning and call res.status(404).end()', function (done) {

        sandbox.spy(app.logger, 'warn');
        exp.use(app.notFound404Handler);
        
        request(exp)
          .get('/')
          .expect(404, function (err) {

            var arg = app.logger.warn.getCall(0).args[0];

            expect(arg.url).to.be.equals('/');
            expect(arg.method).to.be.equals('GET');
            expect(arg.statusCode).to.be.equals(404);
            done(err);

          });

      });
    });

    describe('errorHandler', function () {

      describe('without req.logger and error.statusCode', function () {
        it ('Logs the error, trace and statusCode and calls ' +
        'res.status(500).jsonp({ message: error.message })', function (done) {

          sandbox.stub(app.logger, 'error');
          exp.use(dispatchError, app.errorHandler);

          request(exp)
            .get('/')
            .expect('{"message":"testMessage"}')
            .expect('Content-Type', /json/)
            .expect(500, function (err) {

              var arg = app.logger.error.getCall(0).args[0];

              expect(arg.message).to.be.equals('testMessage');
              expect(arg.statusCode).to.be.equals(500);
              expect(arg.trace).to.be.defined;
              done(err);

            });

          function dispatchError(req, res, next) {
            next(new Error('testMessage'));
          }
          
        });
      });

      describe('with req.logger and without error.statusCode', function () {
        it ('Logs the error, trace and statusCode and calls ' +
        'res.status(500).jsonp({ message: error.message })', function (done) {

          var logger = { error: sandbox.spy() };

          sandbox.spy(app.logger, 'error');
          exp.use(dispatchError, app.errorHandler);

          request(exp)
            .get('/')
            .expect('{"message":"testMessage"}')
            .expect('Content-Type', /json/)
            .expect(500, function (err) {

              var arg = logger.error.getCall(0).args[0];

              expect(app.logger.error.called).to.be.false;
              expect(arg.message).to.be.equals('testMessage');
              expect(arg.statusCode).to.be.equals(500);
              expect(arg.trace).to.be.defined;
              done(err);

            });

          function dispatchError(req, res, next) {

            req.logger = logger;
            next(new Error('testMessage'));

          }

        });
      });

      describe('with req.logger and with error.statusCode = 403', function () {
        it ('Logs the error, trace and statusCode and calls ' +
        'res.status(403).jsonp({ message: error.message })', function (done) {

          var logger = { error: sandbox.spy() };

          sandbox.spy(app.logger, 'error');
          exp.use(dispatchError, app.errorHandler);

          request(exp)
            .get('/')
            .expect('{"message":"testMessage"}')
            .expect('Content-Type', /json/)
            .expect(403, function (err) {

              var arg = logger.error.getCall(0).args[0];

              expect(app.logger.error.called).to.be.false;
              expect(arg.message).to.be.equals('testMessage');
              expect(arg.statusCode).to.be.equals(403);
              expect(arg.trace).to.be.defined;
              done(err);

            });

          function dispatchError(req, res, next) {

            var err = new Error('testMessage');

            req.logger = logger;
            err.statusCode = 403;
            next(err);

          }

        });
      });

    });

    describe('reqLoggerHandler', function () {
      it ('Sets up req logger and call next', function (done) {

        sandbox.spy(logFactory, 'createLogger');
        exp.use(app.reqLoggerHandler, validate);

        request(exp)
          .get('/')
          .end(done);

        function validate(req, res, next) {

          var arg = logFactory.createLogger.getCall(0).args[0];

          expect(arg.reqId).to.be.equals(req.id);
          expect(arg.url).to.be.equals(req.originalUrl);
          expect(arg.method).to.be.equals(req.method);
          res.send();

        }

      });
    });

    describe('create', function () {
      it ('creates an express server, add middleware, routes and returns it.', function () {

        var exp = express();
        var router = express.Router();
        var useSpy = sandbox.spy(exp, 'use');
        var server = app.create(router, exp);

        expect(server)
          .to.be.defined;
        expect(useSpy.withArgs('/api', app.reqLoggerHandler, router).called)
          .to.be.true;
        expect(useSpy.withArgs(app.notFound404Handler).called)
          .to.be.true;
        expect(useSpy.withArgs(app.errorHandler).called)
          .to.be.true;
        expect(useSpy.withArgs(app.notFound404Handler).callIds[0])
          .to.be.above(useSpy.withArgs('/api', app.reqLoggerHandler, router)
            .callIds[0]);

      });
    });

  });

})();
