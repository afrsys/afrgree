'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var supertest = require('supertest');
var api = require('./index.js');
var security = require('./security');
var User = require('./User');
var q = require('q');
var TestServer = require('../../../test/TestServer');

describe('/users/api', function () {

  var appServer, app, sandbox, token;

  before(function () {

    appServer = TestServer.app(api);
    app = appServer.app;

  });

  after(function () {
    appServer.close();
  });

  beforeEach(function (done) {
    
    sandbox = sinon.sandbox.create();
    
    q.all([
      User.remove({}),
      User.create([{
        _id: 'd0ffff000000000000000000',
        name: 'Homer Simpson',
        email: 'homer@simpsons.com',
        credentials: {
          password: {
            hash: '$2a$04$4rSJiwVc8spPeU3gYyk56e621PsoZL/J3Msmc0xzhBpGwsoZDblvS'
          }
        }
      }]),
    ])
    .then(function () {

      security.issueToken('homer@simpsons.com', '1234', 86400000, appServer.logger)
      .then(function (data) {

        token = 'Bearer ' + data.token;
        done();

      }, done);
    });

  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('POST/auth/password/', function () {
    
    it('Returns 200 with an user and token', function (done) {

      supertest(app)
      .post('/api/auth/password/')
      .send({ email: 'homer@simpsons.com', password: '1234' })
      .expect(200)
      .expect(function (res) {

        expect(res.body.token).to.be.defined;
        expect(res.body.timeout).to.at.least(Date.now() + 1000);
        expect(res.body.user.email).to.be.equals('homer@simpsons.com');
        expect(res.body.user._id).to.be.equals('d0ffff000000000000000000');
        expect(res.body.user.credentials).to.be.undefined;

      })
      .end(done);

    });

    it('Returns 400 when missing email', function (done) {

      supertest(app)
      .post('/api/auth/password/')
      .send({ password: '1234' })
      .expect(400)
      .end(done);

    });

    it('Returns 400 when missing password', function (done) {

      supertest(app)
      .post('/api/auth/password/')
      .send({ email: 'homer@simpsons.com' })
      .expect(400)
      .end(done);

    });

    it('Returns 401 when called with wrong password', function (done) {

      supertest(app)
      .post('/api/auth/password/')
      .send({ email: 'homer@simpsons.com', password: 'wrong' })
      .expect(401)
      .end(done);

    });

    it('Returns 401 when called with wrong email', function (done) {

      supertest(app)
      .post('/api/auth/password/')
      .send({ email: 'homero@simpsons.com.cn', password: '1234' })
      .expect(401)
      .end(done);

    });

    it('Returns 500 when redis.get fails', function (done) {

      sandbox.stub(appServer.redis, 'get').yields(new Error('redisError'));

      supertest(app)
      .post('/api/auth/password/')
      .send({ email: 'homer@simpsons.com', password: '1234' })
      .expect(500, { message: 'redisError' })
      .end(done);

    });

  });

  describe('PUT/auth/password/', function () {

    it('Returns 401 when called without token', function (done) {
      supertest(app)
      .put('/api/auth/password/')
      .send({ oldPassword: '1234', newPassword: '4321' })
      .expect(401)
      .end(done);
    });

    it('Returns 400 when called without oldPassword', function (done) {
      supertest(app)
      .put('/api/auth/password/')
      .set('Authorization', token)
      .send({ newPassword: '4321' })
      .expect(400)
      .end(done);
    });

    it('Returns 400 when called without newPassword', function (done) {
      supertest(app)
      .put('/api/auth/password/')
      .set('Authorization', token)
      .send({ oldPassword: '1234' })
      .expect(400)
      .end(done);
    });

    it('Returns 403 when called with wrong oldPassword', function (done) {
      supertest(app)
      .put('/api/auth/password/')
      .set('Authorization', token)
      .send({ newPassword: '4321', oldPassword: 'wrong' })
      .expect(403)
      .end(done);
    });

    it('Returns 500 when user.checkPassword fails', function (done) {
      
      sandbox.stub(User.prototype, 'checkPassword')
      .returns(q.reject(new Error('unknown')));
      
      supertest(app)
      .put('/api/auth/password/')
      .set('Authorization', token)
      .send({ oldPassword: '1234', newPassword: '4321' })
      .expect(500)
      .end(done);

    });

    it('Returns 500 when user.setPassword fails', function (done) {
      
      sandbox.stub(User.prototype, 'setPassword')
      .returns(q.reject(new Error('unknown')));
      
      supertest(app)
      .put('/api/auth/password/')
      .set('Authorization', token)
      .send({ oldPassword: '1234', newPassword: '4321' })
      .expect(500)
      .end(done);

    });

    it('Returns 500 when user.save fails', function (done) {
      
      sandbox.stub(User.prototype, 'save')
      .yields(new Error('mongoError'));

      supertest(app)
      .put('/api/auth/password/')
      .set('Authorization', token)
      .send({ oldPassword: '1234', newPassword: '4321' })
      .expect(500)
      .end(done);

    });

    it('Returns 200 when everything is ok', function (done) {
      supertest(app)
      .put('/api/auth/password/')
      .set('Authorization', token)
      .send({ oldPassword: '1234', newPassword: '4321' })
      .expect(200)
      .end(function (err, res) {
        if (!err) {

          User.findOne({ email: 'homer@simpsons.com' })
          .then(function (user) {

            expect(user.credentials.password.hash)
            .to.not.be.equals('$2a$04$4rSJiwVc8spPeU3gYyk56e621PsoZL/J3Msmc0xzhBpGwsoZDblvS');
            done();

          }, done);

        } else {
          done(err);
        }
      });
    });
    
  });

});
