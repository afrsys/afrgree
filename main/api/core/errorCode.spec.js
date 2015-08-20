(function () {

  'use strict';

  /*jshint expr: true*/
  var chai = require('chai');
  var expect = chai.expect;
  var errorCode = require('./errorCode');
  var sinon = require('sinon');

  describe('errorCode()', function () {

    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('simple call with error and status', function () {
      it('returns the error with statusCode', function () {

        var err = errorCode(new Error('ErrorMessage'), 403);

        expect(err.statusCode).to.be.equals(403);
        expect(err.message).to.be.equals('ErrorMessage');

      });
    });

    describe('simple call with message', function () {
      it('returns an error with 500 and message', function () {

        var err = errorCode(new Error('NoStatusMessage'));

        expect(err.statusCode).to.be.equals(500);
        expect(err.message).to.be.equals('NoStatusMessage');

      });
    });

  });

})();
