(function () {

  'use strict';

  /*jshint expr: true*/
  var expect = require('chai').expect;
  var sinon = require('sinon');
  var passport = require('passport');
  var mocks = require('../../../../test/mocks');
  var security = require('./security.js');
  var User = require('./User');
  var jwt = require('jwt-simple');

  var userdata = {
    _id: 'd0ffff000000000000000000',
    name: 'Homer Simpson',
    email: 'homer@simpsons.com',
    credentials: {
      password : {
        hash: '$2a$04$wp/Yh.0/NVnCWQJGqSlE5OZM7RB4c1MwYuiAfEoJAewiinA3PvpH6'
      }
    }
  };

  describe('security', function () {

    var sandbox, logger;

    beforeEach(function () {

      sandbox = sinon.sandbox.create();
      logger = mocks.logger(sandbox);

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

      var req, verify = security.verifyToken;

      beforeEach(function () {

        req = mocks.req(sandbox);
        sandbox.useFakeTimers();
        sandbox.stub(User, 'findById')
          .withArgs('d0ffff000000000000000000').yields(null, new User(userdata))
          .withArgs('000000000000000000000000').yields(null, null)
          .withArgs('eeeeeeeeeeeeeeeeeeeeeeee').yields(new Error('mongoError'), null);

      });

      describe('valid token', function () {
        it('calls callback with the user', function (done) {

          var token = jwt.encode({ iss: 'd0ffff000000000000000000', exp: 10 }, security.TOKEN_SALT);

          verify(req, token, function (err, user) {

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
      });

      describe('expired token', function () {
        it ('calls callback with invalidToken error', function (done) {

          var token = jwt.encode({ iss: 'd0ffff000000000000000000', exp: -3 }, security.TOKEN_SALT);

          verify(req, token, function (err, user) {

            try {

              expect(err).to.be.not.null;
              expect(err.message).to.be.equals('invalidToken');
              expect(err.statusCode).to.be.equals(401);
              expect(user).to.be.null;
              expect(req.logger.debug.getCall(2).args[0])
              .to.be.deep.equals({ timeout: -3000, now: 0 });
              expect(req.logger.debug.getCall(2).args[1]).to.be.equals('tokenExpired');
              done();

            } catch (err) {
              done(err);
            }

          });

        });
      });

      describe('invalid token - Not enough or too many segments', function () {
        it ('calls callback with invalidToken error', function (done) {
          verify(req, 'x', function (err, user) {

            try {

              expect(err).to.be.not.null;
              expect(err.message).to.be.equals('invalidToken');
              expect(err.statusCode).to.be.equals(401);
              expect(user).to.be.null;
              done();

            } catch (err) {
              done(err);
            }

          });
        });
      });

      describe('invalid token - Signature verification failed', function () {
        it ('calls callback with invalidToken error', function (done) {

          var token = jwt.encode({ iss: 'd0ffff000000000000000000', exp: -3 }, 'wrong salt');

          verify(req, token, function (err, user) {

            try {

              expect(err).to.be.not.null;
              expect(err.message).to.be.equals('invalidToken');
              expect(err.statusCode).to.be.equals(401);
              expect(user).to.be.null;
              done();

            } catch (err) {
              done(err);
            }

          });

        });
      });

      describe('invalid token - Unexpected token |', function () {
        it ('calls callback with invalidToken error', function (done) {

          verify(req, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ8.eyJ1c2VySWQiOiJkMGZmZmYwMDAwMDAwMDAwM' +
          'DAwMDAwMDAiLCJ0aW1lb3V0IjotMTAwMH0.W4mKUZRctNj2Idsb_RCGAAhts-th0oc6GU7bQGQ_jwA',
          function (err, user) {

            try {

              expect(err).to.be.not.null;
              expect(err.message).to.be.equals('invalidToken');
              expect(err.statusCode).to.be.equals(401);
              expect(user).to.be.null;
              done();

            } catch (err) {
              done(err);
            }

          });

        });
      });

      describe('user not found', function () {
        it ('calls callback with invalidToken error', function (done) {

          var token = jwt.encode({ iss: '000000000000000000000000', exp: 10 }, security.TOKEN_SALT);

          verify(req, token, function (err, user) {

            try {

              expect(err).to.be.not.null;
              expect(err.message).to.be.equals('invalidToken');
              expect(err.statusCode).to.be.equals(401);
              expect(user).to.be.null;
              done();

            } catch (err) {
              done(err);
            }

          });

        });
      });

      describe('mongoError', function () {
        it ('calls callback with invalidToken error', function (done) {

          var token = jwt.encode({ iss: 'eeeeeeeeeeeeeeeeeeeeeeee', exp: 10 }, security.TOKEN_SALT);

          verify(req, token, function (err, user) {

            try {

              expect(err).to.be.not.null;
              expect(user).to.be.null;
              expect(err.message).to.be.equals('mongoError');
              done();

            } catch (err) {
              done(err);
            }

          });

        });
      });

    });

    describe('issueToken', function () {

      beforeEach(function () {
        sandbox.stub(User, 'findOne')
          .withArgs({ email: 'homer@simpsons.com' }).yields(null, new User(userdata))
          .withArgs({ email: 'homero@simpsons.com.cn' }).yields(null, null)
          .withArgs({ email: 'bluescreen@microsoft.com' }).yields(new Error('mongoError'), null);
      });

      describe('valid username and password', function () {
        it('calls promise { token, timeout, user { _id, name, email } }', function (done) {
          security.issueToken('homer@simpsons.com', '1234', logger)
            .then(function (data) {

              expect(data.token).to.be.defined;
              expect(data.timeout).to.be.defined;
              expect(data.user._id.toString()).to.be.equals('d0ffff000000000000000000');
              expect(data.user.email).to.be.equals('homer@simpsons.com');
              expect(data.user.name).to.be.equals('Homer Simpson');
              done();

            }).catch(done);
        });
      });

      describe('invalid username', function () {
        it('reject promise w/ invalidPasswordError', function (done) {
          security.issueToken('homero@simpsons.com.cn', '1234', logger)
            .then(function () {
              done(new Error('Unexpected call'));
            })
            .catch(function (err) {

              expect(err.message).to.be.equals('invalidUsernamePassword');
              done();

            });
        });
      });

      describe('wrong password', function () {
        it('reject promise w/ invalidPasswordError', function (done) {
          security.issueToken('homer@simpsons.com', 'noMoreBeer', logger)
            .then(function () {
              done(new Error('Unexpected call'));
            })
            .catch(function (err) {

              expect(err.message).to.be.equals('invalidUsernamePassword');
              done();

            });
        });
      });

      describe('no password', function () {
        it('reject promise w/ invalidPasswordError', function (done) {
          security.issueToken('homer@simpsons.com', null, logger)
            .then(function () {
              done(new Error('Unexpected call'));
            })
            .catch(function (err) {

              expect(err.message).to.be.equals('invalidUsernamePassword');
              done();

            });
        });
      });

      describe('bcryptError', function () {
        it('reject promise w/ bcryptError', function (done) {

          var bcrypt = require('bcryptjs');

          sandbox.stub(bcrypt, 'compare').yields(new Error('bcryptError'));
          security.issueToken('homer@simpsons.com', '1234', logger)
            .then(function () {
              done(new Error('Unexpected call'));
            })
            .catch(function (err) {

              expect(err.message).to.be.equals('bcryptError');
              done();

            });

        });
      });

      describe('mongoError', function () {
        it('reject promise w/ mongoError', function (done) {
          security.issueToken('bluescreen@microsoft.com', '1234', logger)
            .then(function () {
              done(new Error('Unexpected call'));
            })
            .catch(function (err) {

              expect(err.message).to.be.equals('mongoError');
              done();

            });
        });
      });

    });

  });

})();
