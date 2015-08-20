(function () {

  'use strict';

  /*jshint expr: true*/
  var expect = require('chai').expect;
  var events = require('events');
  var sinon = require('sinon');
  var mongoose = require('mongoose');
  var db = require('./db');

  describe('db', function () {

    var sandbox, emitter, info, error;

    beforeEach(function () {

      sandbox = sinon.sandbox.create();
      emitter = new events.EventEmitter();
      sandbox.stub(mongoose.connection, 'on', function () {
        emitter.on.apply(emitter, arguments);
      });
      sandbox.stub(mongoose.connection, 'once', function () {
        emitter.once.apply(emitter, arguments);
      });
      info = sandbox.stub(db.logger, 'info');
      error = sandbox.stub(db.logger, 'error');
      
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('connect', function () {

      describe('successful connection', function () {
        it('calls mongoose connect, and return a promisse', function (done) {

          var connect = sandbox.stub(mongoose, 'connect', function () {
            emitter.emit('connected');
          });

          db.connect()
            .then(function () {

              expect(connect.calledOnce).to.be.true;
              expect(info.calledOnce).to.be.true;
              done();

            })
            .catch(done);

        });
      });

      describe('connection error', function () {
        it('calls mongoose connect, and return a promisse', function (done) {
          
          var connect = sandbox.stub(mongoose, 'connect', function () {
            emitter.emit('error', new Error('connection error'));
          });

          db.connect()
            .then(function () {
              done(new Error('Unexpected call'));
            }, function (err) {

              expect(err).to.be.defined;
              expect(error.calledOnce).to.be.true;
              expect(connect.calledOnce).to.be.true;
              done();

            });

        });
      });

    });

  });

})();
