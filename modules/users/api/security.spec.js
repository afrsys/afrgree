'use strict';

/*jshint expr: true*/
var expect = require('chai').expect;
var sinon = require('sinon');
var passport = require('passport');
var q = require('q');
var jwt = require('jwt-simple');
var security = require('./security.js');
var User = require('./User');
var mongoStub = require('../../../test/mongoStub');
var TestServer = require('../../../test/TestServer');
var userdata = require('../../../test/data/users');
var logger = TestServer.logger();

describe('security', function () {

  var mongoServer, sandbox;

  before(function () {
    mongoServer = TestServer.mongo(logger);
  });

  after(function () {
    mongoServer.close();
  });

  beforeEach(function (done) {

    sandbox = sinon.sandbox.create();
    q.all([
      User.remove({}).then(),
      User.create([userdata[0]]),
    ])
    .finally(done);

  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('isAuth()', function () {
    it('calls passport.authenticate', function () {

      sandbox.spy(passport, 'authenticate');
      security.isAuth();
      expect(passport.authenticate.called).to.be.true;
      expect(passport.authenticate.getCall(0).args[0]).to.be.equals('bearer');

    });

  });

  describe('verifyToken()', function () {

    var req = {};

    beforeEach(function () {

      req.logger = logger;
      sandbox.useFakeTimers();

    });

    it('valid token calls callback with the user', function (done) {

      var token = jwt.encode({ iss: 'aaaaaaaf0000000f00001111', exp: 10 }, security.TOKEN_SALT);

      security.verifyToken(req, token, function (err, user) {

        try {

          expect(err).to.be.null;
          expect(user).to.not.be.null;
          expect(user.email).to.be.equals('homer@simpsons.com');
          done();

        } catch (err) {
          done(err);
        }

      });

    });

    it('expired token calls callback with invalidToken error', function (done) {

      var token = jwt.encode({ iss: 'aaaaaaaf0000000f00001111', exp: -3 }, security.TOKEN_SALT);

      security.verifyToken(req, token, function (err, user) {

        expect(err).to.be.not.null;
        expect(err.message.startsWith('security.invalidToken')).to.be.true;
        expect(user).to.not.be.defined;
        done();

      });

    });

    it('Token: Not enough or too many segments calls callback with invalidToken', function (done) {

      security.verifyToken(req, 'x', function (err, user) {

        expect(err).to.be.not.null;
        expect(err.message.startsWith('security.invalidToken')).to.be.true;
        expect(user).to.not.be.defined;
        done();

      });

    });

    it('Token: Signature verification failed calls callback with invalidToken', function (done) {

      var token = jwt.encode({ iss: 'aaaaaaaf0000000f00001111', exp: 3 }, 'wrong salt');

      security.verifyToken(req, token, function (err, user) {

        expect(err).to.be.not.null;
        expect(err.message.startsWith('security.invalidToken')).to.be.true;
        expect(user).to.not.be.defined;
        done();

      });

    });

    it('Token: Unexpected tokencalls callback with invalidToken error', function (done) {

      security.verifyToken(req, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ8.eyJ1c2VySWQiOiJkMGZmZmYwMD' +
        'AwMDAwMDAwMDAwMDAwMDAiLCJ0aW1lb3V0IjotMTAwMH0.W4mKUZRctNj2Idsb_RCGAAhts-th0oc6GU7bQGQ_jwA',
      function (err, user) {

        expect(err).to.be.not.null;
        expect(err.message.startsWith('security.invalidToken')).to.be.true;
        expect(user).to.not.be.defined;
        done();

      });

    });

    it('User not found calls callback with invalidToken error', function (done) {

      var token = jwt.encode({ iss: '000000000000000000000000', exp: 10 }, security.TOKEN_SALT);

      security.verifyToken(req, token, function (err, user) {

        expect(err).to.be.not.null;
        expect(err.message.startsWith('security.invalidToken')).to.be.true;
        expect(user).to.not.be.defined;
        done();

      });

    });

    it('mongo error calls callback with invalidToken error', function (done) {

      var token = jwt.encode({ iss: 'aaaaaaaf0000000f00001111', exp: 10000 }, security.TOKEN_SALT);

      mongoStub.queryError(User, sandbox);
      
      security.verifyToken(req, token, function (err, user) {
          
        expect(err).to.be.not.null;
        expect(user).to.not.be.defined;
        expect(err.message).to.be.equals('mongoQueryError');
        done();

      });

    });

  });

  describe('issueToken', function () {

    it('valid username and password calls promise', function (done) {
      
      security.issueToken('homer@simpsons.com', '1234', 86400000, logger)
      .then(function (data) {

        expect(data.token).to.be.defined;
        expect(data.timeout).to.be.defined;
        expect(data.user._id.toString()).to.be.equals('aaaaaaaf0000000f00001111');
        expect(data.user.email).to.be.equals('homer@simpsons.com');
        expect(data.user.name).to.be.equals('Homer Simpson');
        done();

      })
      .catch(done);

    });

    it('invalid username reject promise w/ security.userNotFound', function (done) {
      security.issueToken('homero@simpsons.com.cn', '1234', 86400000, logger)
      .then(function () {
        done(new Error('Unexpected call'));
      })
      .catch(function (err) {

        expect(err.message.startsWith('security.userNotFound')).to.be.true;
        done();

      });
    });

    it('wrong password reject promise w/ security.wrongPassword', function (done) {
      security.issueToken('homer@simpsons.com', 'noMoreBeer', 86400000, logger)
      .then(function () {
        done(new Error('Unexpected call'));
      })
      .catch(function (err) {

        expect(err.message.startsWith('user.wrongPassword')).to.be.true;
        done();

      });
    });

    it('without password reject promise w/ security.wrongPassword', function (done) {
      security.issueToken('homer@simpsons.com', null, 86400000, logger)
      .then(function () {
        done(new Error('Unexpected call'));
      })
      .catch(function (err) {

        expect(err.message.startsWith('user.wrongPassword')).to.be.true;
        done();

      });
    });

    it('brcyptError reject promise w/ bcryptError', function (done) {

      var bcrypt = require('bcryptjs');

      sandbox.stub(bcrypt, 'compare').yields(new Error('bcryptError'));
      security.issueToken('homer@simpsons.com', '1234', 86400000, logger)
      .then(function () {
        done(new Error('Unexpected call'));
      })
      .catch(function (err) {

        expect(err.message).to.be.equals('bcryptError');
        done();

      });

    });

    it('mongoQueryError reject promise w/ mongoQueryError', function (done) {

      mongoStub.queryError(User, sandbox);

      security.issueToken('bluescreen@microsoft.com', '1234', 86400000, logger)
        .then(function () {
          done(new Error('Unexpected call'));
        })
        .catch(function (err) {

          expect(err.message).to.be.equals('mongoQueryError');
          done();

        });

    });

  });

});
