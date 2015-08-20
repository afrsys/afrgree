(function () {

  'use strict';
  /*jshint expr: true*/
  var expect = require('chai').expect;
  var sinon = require('sinon');
  var logFactory = require('./logFactory');
  var config = require('../config');
  var bunyan = require('bunyan');

  describe('logFactory', function () {

    var sandbox;
    
    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('rootLogger', function () {
      it ('must exists and be configured with config values', function () {

        var rootLogger = logFactory.rootLogger;
        var stream = rootLogger.streams[0];

        expect(rootLogger).to.be.defined;
        expect(stream.level).to.be.equals(bunyan[config.logLevel.toUpperCase()]);

      });
    });

    describe('createLogger(opts)', function () {

      beforeEach(function () {

        sandbox.stub(logFactory.rootLogger, 'child')
          .returns({ id: 'fakeLogger' });

      });
      
      it ('Calls rootLogger.child(opts)', function () {

        var childLogger = logFactory.createLogger({ type: 'test' });
        var arg = logFactory.rootLogger.child.getCall(0).args[0];

        expect(childLogger.id)
          .to.be.equals('fakeLogger');
        expect(arg.module)
          .to.be.undefined;
        expect(arg.type)
          .to.be.equals('test');

      });

    });
    
  });

})();
