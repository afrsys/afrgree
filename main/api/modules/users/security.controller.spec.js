(function () {

  'use strict';

  /*jshint expr: true*/
  var sinon = require('sinon');
  var q = require('q');
  var bodyParser = require('body-parser');
  var express = require('express');
  var request = require('supertest');
  var mocks = require('../../../../test/mocks');
  var security = require('./security.js');
  var securityController = require('./security.controller.js');
  var securityRouter = require('./security.router.js');
  var User = require('./User.js');
  var expect = require('chai').expect;
  var userdata = { name: 'Aron Teixeira Rodrigues', email: 'aronrodrigues@gmail.com' };
  
  describe('security.controller', function () {

    var sandbox, app, logger;

    function addLogger(req, res, next) {

      req.logger = logger;
      next();

    }

    function errorHandler(err, req, res, next) {
      return res.status(err.statusCode || 500).jsonp({ message: err.message });
    }

    beforeEach(function () {

      app = express();
      app.use(bodyParser.json());
      
      sandbox = sinon.sandbox.create();
      logger = mocks.logger(sandbox);

    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('authPassword', function () {

      beforeEach(function () {

        var issueTokenStub = sandbox.stub(security, 'issueToken');

        app.use(addLogger, securityRouter, errorHandler);

        issueTokenStub
          .withArgs('homer@simpsons.com', '1234', logger)
          .returns(q.resolve({ token: 'token', user: 'user', timeout: 'timeout' }));
          
        issueTokenStub
          .withArgs('homer@simpsons.com', 'wrong', logger)
          .returns(q.reject(new Error('issueTokenError')));

      });

      describe('no email', function () {
        it ('Calls next with 400:ReferenceError', function (done) {

          request(app)
            .post('/auth/password')
            .send({ password: '1234' })
            .expect(400)
            .end(done);

        });
      });

      describe('no password', function () {
        it ('Calls next with 400:ReferenceError', function (done) {

          request(app)
            .post('/auth/password')
            .send({ email: 'homer@simpsons.com' })
            .expect(400)
            .end(done);

        });
      });

      describe('valid email and password', function () {
        it ('Calls', function (done) {

          request(app)
            .post('/auth/password')
            .send({ email: 'homer@simpsons.com', password: '1234' })
            .expect(200, '{"token":"token","user":"user","timeout":"timeout"}')
            .end(done);

        });
      });

      describe('invalid email and password', function () {
        it ('Calls', function (done) {

          request(app)
            .post('/auth/password')
            .send({ email: 'homer@simpsons.com', password: 'wrong' })
            .expect(500, '{"message":"issueTokenError"}')
            .end(done);

        });
      });

    });

    describe('changePassword', function () {

      var mockReq;

      beforeEach(function () {

        mockReq = {};
        app.use(function (req, res, next) {

          req.user = mockReq.user;
          req.logger = mockReq.logger;
          next();

        });
        
        app.post('/changePassword', securityController.changePassword);
        app.use(errorHandler);

      });

      it('Returns 400 when missing user', function (done) {

        mockReq.logger = logger;
        request(app)
        .post('/changePassword')
        .send({ oldPassword: '1234', newPassword: '4321' })
        .expect(400)
        .end(done);

      });

      it('Returns 400 when missing logger', function (done) {

        mockReq.user = new User({ username: '' });
        request(app)
        .post('/changePassword')
        .send({ oldPassword: '1234', newPassword: '4321' })
        .expect(400)
        .end(done);

      });

      it('Returns 400 when missing oldPassword', function (done) {

        mockReq.user = new User(userdata);
        mockReq.logger = logger;
        request(app)
        .post('/changePassword')
        .send({ oldPassword: '4321' })
        .expect(400)
        .end(done);

      });

      it('Returns 400 when missing newPassword', function (done) {

        mockReq.user = new User(userdata);
        mockReq.logger = logger;
        request(app)
        .post('/changePassword')
        .send({ newPassword: '4321' })
        .expect(400)
        .end(done);

      });

      it('Returns 403 when the password does not match', function (done) {

        sandbox.stub(User.prototype, 'checkPassword')
        .returns(q.reject(new Error('invalidUsernamePassword')));
        mockReq.user = new User(userdata);
        mockReq.logger = logger;
        request(app)
        .post('/changePassword')
        .send({ oldPassword: '1234', newPassword: '4321' })
        .expect(403)
        .end(done);

      });

      it('Returns 500 when user.checkPassword fails', function (done) {
        
        sandbox.stub(User.prototype, 'checkPassword').returns(q.reject(new Error('unknown')));
        mockReq.user = new User(userdata);
        mockReq.logger = logger;
        request(app)
        .post('/changePassword')
        .send({ oldPassword: '1234', newPassword: '4321' })
        .expect(500)
        .end(done);

      });

      it('Returns 500 when user.setPassword fails', function (done) {
        
        sandbox.stub(User.prototype, 'checkPassword').returns(q.resolve());
        sandbox.stub(User.prototype, 'setPassword').returns(q.reject(new Error('unknown')));
        mockReq.user = new User(userdata);
        mockReq.logger = logger;
        request(app)
        .post('/changePassword')
        .send({ oldPassword: '1234', newPassword: '4321' })
        .expect(500)
        .end(done);

      });

      it('Returns 500 when user.save fails', function (done) {
        
        sandbox.stub(User.prototype, 'checkPassword').returns(q.resolve());
        sandbox.stub(User.prototype, 'save').yields(new Error('mongoError'));
        mockReq.user = new User(userdata);
        mockReq.logger = logger;
        request(app)
        .post('/changePassword')
        .send({ oldPassword: '1234', newPassword: '4321' })
        .expect(500)
        .end(done);

      });

      it('Returns 200 when everything is ok', function (done) {
        
        sandbox.stub(User.prototype, 'checkPassword').returns(q.resolve());
        sandbox.stub(User.prototype, 'save').yields(null);
        mockReq.user = new User(userdata);
        mockReq.logger = logger;
        var oldHash = mockReq.user.credentials.password.hash;

        request(app)
        .post('/changePassword')
        .send({ oldPassword: '1234', newPassword: '4321' })
        .expect(200)
        .expect(function () {
          expect(mockReq.user.credentials.password.hash).to.not.be.equals(oldHash);
        })
        .end(done);

      });

    });

  });

})();

