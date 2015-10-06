'use strict';
/*jshint expr: true*/
var expect = require('chai').expect;
var sinon = require('sinon');
var User = require('./User.js');
var bcrypt = require('bcryptjs');
var Test = require('../../../test');

describe('User', function () {

  var sandbox, user;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('setPassword', function () {

    var factor = 4;

    beforeEach(function () {
      user = new User();
    });

    describe('simple call', function () {
      it('hashs and store the password of the user', function (done) {
        
        expect(user.credentials.password.hash).to.be.undefined;
        user.setPassword('1234', factor, Test.logger).then(function () {

          expect(user.credentials.password.hash.length).to.be.equals(60);
          done();

        });

      });
    });

    describe('called twice with the same password', function () {
      it('hashs and store the password of the user', function (done) {
        user.setPassword('1234', factor, Test.logger).then(function () {

          var pwd1 = user.credentials.password.hash;

          user.setPassword('1234', factor, Test.logger).then(function () {

            var pwd2 = user.credentials.password.hash;

            expect(pwd1).to.not.be.equals(pwd2);
            done();

          });

        });
      });
    });

    describe('bcrypt error', function () {
      it('rejects the promise with bcryptError', function (done) {

        sandbox.stub(bcrypt, 'hash').yields(new Error('bcryptError'));
        user.setPassword('1234', factor, Test.logger).then(null, function (err) {

          expect(err.message).to.be.equals('bcryptError');
          done();

        });

      });
    });

  });

  describe('checkPassword', function () {

    beforeEach(function () {

      var hash = '$2a$04$4rSJiwVc8spPeU3gYyk56e621PsoZL/J3Msmc0xzhBpGwsoZDblvS';
      
      user = new User();
      user.credentials.password.hash = hash;
      sandbox.spy(Test.logger, 'warn');

    });

    describe('valid password', function () {

      describe('fastCall > 200ms', function () {
        it('calls success function and logs warning', function (done) {

          sandbox.stub(Date, 'now').returns(100).onFirstCall().returns(0);
          user.checkPassword('1234', Test.logger).then(function () {

            expect(Test.logger.warn.calledOnce).to.be.true;
            expect(Test.logger.warn.getCall(0).args[0].elapsed).to.be.equals(100);
            done();

          });

        });
      });

      describe('slowCall > 500ms', function () {
        it('calls success function and logs warning', function (done) {

          sandbox.stub(Date, 'now').returns(501)
          .onFirstCall().returns(0);
          user.checkPassword('1234', Test.logger).then(function () {

            expect(Test.logger.warn.calledOnce).to.be.true;
            expect(Test.logger.warn.getCall(0).args[0].elapsed).to.be.equals(501);
            done();

          });

        });
      });

      describe('regular call', function () {
        it('calls success function', function (done) {

          sandbox.stub(Date, 'now').returns(250)
          .onFirstCall().returns(0);
          user.checkPassword('1234', Test.logger).then(function () {

            expect(true).to.be.true;
            expect(Test.logger.warn.called).to.be.false;
            done();

          });

        });
      });

    });

    describe('invalid password', function () {

      describe('fastCall > 200ms', function () {
        it('calls error funcion', function (done) {

          sandbox.stub(Date, 'now').returns(100)
          .onFirstCall().returns(0);
          user.checkPassword('wrong', Test.logger).then(null, function (err) {

            expect(Test.logger.warn.calledOnce).to.be.true;
            expect(Test.logger.warn.getCall(0).args[0].elapsed).to.be.equals(100);
            expect(err).to.not.be.defined;
            done();

          });

        });
      });

      describe('slowCall > 500ms', function () {
        it('calls error funcion', function (done) {

          sandbox.stub(Date, 'now').returns(501)
          .onFirstCall().returns(0);
          user.checkPassword('wrong', Test.logger).then(null, function (err) {

            expect(Test.logger.warn.calledOnce).to.be.true;
            expect(Test.logger.warn.getCall(0).args[0].elapsed).to.be.equals(501);
            expect(err).to.not.be.defined;
            done();

          });

        });
      });

      describe('regular call', function () {
        it('calls error function', function (done) {

          sandbox.stub(Date, 'now').returns(250)
          .onFirstCall().returns(0);
          user.checkPassword('wrong', Test.logger).then(null, function (err) {

            expect(Test.logger.warn.called).to.be.false;
            expect(err).to.be.defined;
            done();

          });

        });
      });

    });

    describe('bcrypt error', function () {
      it('rejects the promise with bcryptError', function (done) {

        sandbox.stub(bcrypt, 'hash').yields(new Error('bcryptError'));
        user.checkPassword('wrong', Test.logger).then(null, function (err) {

          expect(err.message).to.be.equals('bcryptError');
          done();

        });

      });
    });

  });

});
