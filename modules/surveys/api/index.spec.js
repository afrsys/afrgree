'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var supertest = require('supertest');
var q = require('q');
var _ = require('lodash');
var api = require('./index.js');
var security = require('../../users/api/security');
var User = require('../../users/api/User');
var Survey = require('./Survey');
var TestServer = require('../../../test/TestServer');
var surveyData = require('../../../test/data/surveys');
var userData = require('../../../test/data/users');
var mongoStub = require('../../../test/mongoStub');

describe('/surveys/api', function () {

  var appServer, app, sandbox, token;

  before(function () {

    appServer = TestServer.app('/surveys', api);
    app = appServer.app;

  });

  after(function () {
    appServer.close();
  });

  beforeEach(function (done) {
    
    sandbox = sinon.sandbox.create();
    
    q.all([
      User.remove({})
      .then(User.create(userData)),
      Survey.remove({})
      .then(Survey.create(surveyData)),
    ])
    .then(function () {

      security.issueToken('homer@simpsons.com', '1234', 86400000, appServer.logger)
      .then(function (data) {

        token = 'Bearer ' + data.token;
        done();

      }, done);

    })
    .catch(done);

  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('GET/surveys/', function () {
    
    it('Returns 200 with pagesize items', function (done) {

      supertest(app)
      .get('/surveys/')
      .set('Authorization', token)
      .expect(200)
      .expect(function (res) {

        expect(res.body.length).to.be.equals(20);
        expect(res.body[0]._id.toString()).to.be.equals('eeeeeeef0000000f00000000');
        expect(res.body[1]._id.toString()).to.be.equals('eeeeeeef0000000f00001111');
        expect(res.body[2]._id.toString()).to.be.equals('eeeeeeef0000000f00002222');

      })
      .end(done);

    });

    it('Returns 401 when called without token', function (done) {

      supertest(app)
      .get('/surveys/')
      .expect(401)
      .end(done);

    });

    it('Returns 204 with no data', function (done) {

      Survey.remove({}).then(function () {

        supertest(app)
        .get('/surveys')
        .set('Authorization', token)
        .expect(204, [])
        .end(done);

      });
      
    });

    it('Returns 200 with skiping some registers', function (done) {

      supertest(app)
      .get('/surveys?i=1')
      .set('Authorization', token)
      .expect(200)
      .expect(function (res) {

        expect(res.body.length).to.be.equals(20);
        expect(res.body[0]._id.toString()).to.be.equals('eeeeeeef0000000f00001111');

      })
      .end(done);

    });

    it('Returns 500 when mongo throws an error', function (done) {

      mongoStub.queryError(Survey, sandbox);
      
      supertest(app)
      .get('/surveys')
      .set('Authorization', token)
      .expect(500, { message: 'mongoQueryError' })
      .end(done);

    });

  });

  describe('GET/surveys/:id', function () {

    it('valid id returns 200 with data', function (done) {

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00001111')
      .set('Authorization', token)
      .expect(200)
      .expect(function (res) {

        expect(res.body._id.toString()).to.be.equals('eeeeeeef0000000f00001111');

      })
      .end(done);

    });

    it('return 401 when called withou token', function (done) {

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00001111')
      .expect(401)
      .end(done);

    });

    it('returns 404 with no data when called with wrong id', function (done) {

      supertest(app)
      .get('/surveys/0000000f0000000f00000000')
      .set('Authorization', token)
      .expect(404)
      .end(done);

    });

    it('returns 500 when mongo throws an error', function (done) {

      mongoStub.queryError(Survey, sandbox);

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00001111')
      .set('Authorization', token)
      .expect(500, { message: 'mongoQueryError' })
      .end(done);

    });

  });

  describe('POST/surveys/', function () {

    it('returns 201 with the new survey', function (done) {

      supertest(app)
      .post('/surveys')
      .set('Authorization', token)
      .send({ title: 'title', description: 'description', closeDate: Date.now() + (3600 * 1000) })
      .expect(201)
      .expect(function (res) {
        
        expect(res.body.title).to.be.equals('title');
        expect(res.body.description).to.be.equals('description');
        expect(parseInt(new Date(res.body.closeDate).getTime() / 10000))
        .to.be.equals(parseInt((Date.now() + (3600 * 1000)) / 10000));
        expect(res.body._id).to.be.defined;
        expect(parseInt(new Date(res.body.createDate).getTime() / 10000))
        .to.be.equals(parseInt(Date.now() / 10000));

      }).end(function (err, res) {

        if (!err) {
            
          Survey.findOne({ _id: res.body._id })
          .then(function (survey) {

            expect(survey).to.exists;
            done();

          }, done);

        } else { done(err); }

      });

    });

    it('returns 401 when called without token', function (done) {

      supertest(app)
      .post('/surveys')
      .send({ title: 'title', description: 'description', closeDate: Date.now() + (3600 * 1000) })
      .expect(401)
      .end(done);

    });

    it('returns 400 when missing title', function (done) {

      supertest(app)
      .post('/surveys')
      .set('Authorization', token)
      .send({ description: 'description', closeDate: Date.now() + (3600 * 1000) })
      .expect(400)
      .end(done);

    });

    it('returns 400 when missing description', function (done) {

      supertest(app)
      .post('/surveys')
      .set('Authorization', token)
      .send({ title: 'title', closeDate: Date.now() + (3600 * 1000) })
      .expect(400)
      .end(done);

    });

    it('returns 400 when missing closeDate', function (done) {

      supertest(app)
      .post('/surveys')
      .set('Authorization', token)
      .send({ title: 'title', description: 'description' })
      .expect(400)
      .end(done);

    });

    it('returns 400 when closeDate is invalid', function (done) {

      supertest(app)
      .post('/surveys')
      .set('Authorization', token)
      .send({ title: 'title', description: 'description', closeDate: new Date(0).toString() })
      .expect(400)
      .end(done);

    });

    it('returns 400 when closeDate is invalid', function (done) {

      supertest(app)
      .post('/surveys')
      .set('Authorization', token)
      .send({ title: 'title', description: 'description', closeDate: 'invalidDate' })
      .expect(400)
      .end(done);

    });

    it('returns 500 on error', function (done) {

      mongoStub.writeError(Survey, sandbox);

      supertest(app)
      .post('/surveys')
      .set('Authorization', token)
      .send({ title: 'title', description: 'description', closeDate: Date.now() + (3600 * 1000) })
      .expect(500, { message: 'mongoWriteError' })
      .end(done);

    });

  });

  describe('POST/surveys/:id/post', function () {

    it('returns 201 with the new post', function (done) {

      var message = Math.random() + ' ' + Date.now();

      supertest(app)
      .post('/surveys/eeeeeeef0000000f00001111/posts')
      .set('Authorization', token)
      .send({ message: message })
      .expect(201)
      .expect(function (res) {

        expect(res.body.message).to.be.equals(message);
        expect(res.body.user.name).to.be.equals('Homer Simpson');
        expect(res.body.date).to.at.least(Date.now() - 1000);
      
      })
      .end(function (err, res) {

        if (!err) {
          
          Survey.findOne({ _id: 'eeeeeeef0000000f00001111' })
          .then(function (survey) {

            expect(_(survey.posts).find({ message: message })).to.exists;
            done();

          }, done);

        } else { done(err); }

      });

    });

    it('returns 401 when called without token', function (done) {

      var message = Math.random() + ' ' + Date.now();

      supertest(app)
      .post('/surveys/eeeeeeef0000000f00001111/posts')
      .send({ message: message })
      .expect(401)
      .end(done);

    });

    it('returns 404 when the id is invalid', function (done) {

      supertest(app)
      .post('/surveys/eeeeeeef0000000fffffffff/posts')
      .set('Authorization', token)
      .send({ message: 'Bla bla bla' })
      .expect(404)
      .end(done);

    });

    it('returns 500 when save throws an error', function (done) {

      mongoStub.writeError(Survey, sandbox);

      supertest(app)
      .post('/surveys/eeeeeeef0000000f00001111/posts')
      .set('Authorization', token)
      .send({ message: 'Bla bla bla' })
      .expect(500, { message: 'mongoWriteError' })
      .end(done);

    });

    it('returns 500 when find throws an error', function (done) {

      mongoStub.queryError(Survey, sandbox);

      supertest(app)
      .post('/surveys/eeeeeeef0000000f00001111/posts')
      .set('Authorization', token)
      .send({ message: 'Bla bla bla' })
      .expect(500, { message: 'mongoQueryError' })
      .end(done);

    });

    it('returns 400 when no message is passed', function (done) {

      supertest(app)
      .post('/surveys/eeeeeeef0000000f00001111/posts')
      .set('Authorization', token)
      .expect(400)
      .end(done);

    });

    it('returns 400 when the survey is not active', function (done) {

      supertest(app)
      .post('/surveys/eeeeeeef0000000f11111111/posts')
      .set('Authorization', token)
      .send({ message: 'Bla bla bla' })
      .expect(400)
      .end(done);

    });

  });

  describe('GET/surveys/:id/post', function () {

    it('returns 200 with data from 0 whe no i is passed', function (done) {

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00000000/posts')
      .set('Authorization', token)
      .expect(200)
      .expect(function (res) {

        expect(res.body.length).to.be.equals(20);
        expect(res.body[0].message).to.be.equals('20000 bla bla bla');
        expect(res.body[19].message).to.be.equals('1000 bla bla bla bla');

      })
      .end(done);

    });

    it('returns 200 with data with data from i', function (done) {

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00000000/posts?i=5')
      .set('Authorization', token)
      .expect(200)
      .expect(function (res) {

        expect(res.body.length).to.be.equals(16);
        expect(res.body[0].message).to.be.equals('21000 bla bla bla');
        expect(res.body[15].message).to.be.equals('6000 bla bla bla bla');

      })
      .end(done);

    });

    it('returns 204 when no data is retrieved empty array', function (done) {

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00001111/posts')
      .set('Authorization', token)
      .expect(204)
      .end(done);

    });

    it('returns 404 with no data when called with wrong id', function (done) {

      supertest(app)
      .get('/surveys/0000000f0000000f00000000/posts')
      .set('Authorization', token)
      .expect(404)
      .end(done);

    });

    it('returns 500 when mongo throws an error', function (done) {

      mongoStub.queryError(Survey, sandbox);

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00001111/posts')
      .set('Authorization', token)
      .expect(500)
      .end(done);

    });

  });

  describe('GET/surveys/:id/post/{newest}', function () {

    it('returns 200 with data newer than parameter', function (done) {

      var newest = surveyData[0].posts[7].date;

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00000000/posts/' + newest)
      .set('Authorization', token)
      .expect(200)
      .expect(function (res) {

        expect(res.body.length).to.be.equals(7);
        expect(res.body[0].message).to.be.equals('7000 bla bla bla bla');
        expect(res.body[6].message).to.be.equals('1000 bla bla bla bla');

      })
      .end(done);

    });

    it('returns 204 when no data is returned', function (done) {

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00000000/posts/' + (Date.now()))
      .set('Authorization', token)
      .expect(204)
      .end(done);

    });

    it('returns 401 when called without token', function (done) {

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00000000/posts/100')
      .expect(401)
      .end(done);

    });

    it('returns 404 when called with an invalid id', function (done) {

      supertest(app)
      .get('/surveys/0000000f0000000f00000000/posts/100')
      .set('Authorization', token)
      .expect(404)
      .end(done);

    });

    it('returns 500 when mongo throws an error', function (done) {

      mongoStub.queryError(Survey, sandbox);

      supertest(app)
      .get('/surveys/eeeeeeef0000000f00001111/posts/100')
      .set('Authorization', token)
      .expect(500)
      .end(done);

    });

  });

});
