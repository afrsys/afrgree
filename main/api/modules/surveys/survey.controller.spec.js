(function () {

  'use strict';

  /*jshint expr: true*/
  var sinon = require('sinon');
  var bodyParser = require('body-parser');
  var express = require('express');
  var request = require('supertest');
  var expect = require('chai').expect;
  var q = require('q');
  var mocks = require('../../../../test/mocks');
  var surveyController = require('./survey.controller.js');
  var Survey = require('./Survey.js');
  var User = require('../users/User.js');

  var mongoose = require('mongoose');
  var surveyData = require('../../../../test/data/surveys');
  var userData = require('../../../../test/data/users');

  var config = require('../../config');
  
  describe.skip('survey.controller', function () {

    var sandbox, app, logger, query;

    function addLogger(req, res, next) {

      req.logger = logger;
      next();

    }

    function addUser(user) {

      return function (req, res, next) {

        req.user = user;
        next();
        
      };

    }

    function errorHandler(err, req, res, next) {
      return res.status(err.statusCode || 500).jsonp({ message: err.message });
    }

    beforeEach(function () {

      app = express();
      app.use(bodyParser.json());
      sandbox = sinon.sandbox.create();
      logger = mocks.logger(sandbox);
      query = mongoose.Query.prototype;
      sandbox.spy(query, 'limit');
      sandbox.spy(query, 'sort');
      sandbox.spy(query, 'skip');

    });

    afterEach(function () {
      sandbox.restore();
    });

    describe('list', function () {

      beforeEach(function () {
        app.use(addLogger, surveyController.router, errorHandler);
      });

      it ('returns 200 with data', function (done) {

        sandbox.spy(Survey, 'find');
        sandbox.stub(query, 'exec').returns(q.resolve(surveyData));

        request(app)
          .get('/')
          .expect(200)
          .expect(function (response) {

            expect(Survey.find.getCall(0).args[1].title).to.be.equals(1);
            expect(Survey.find.getCall(0).args[1].closeDate).to.be.equals(1);
            expect(query.limit.getCall(0).args[0]).to.be.equals(config.pageSize);
            expect(query.sort.getCall(0).args[0].closeDate).to.be.equals(-1);
            expect(query.skip.getCall(0).args[0]).to.be.equals(0);
            expect(response.body.length).to.be.equals(surveyData.length);

          })
          .end(done);

      });

      it ('returns 200 with data and skip is called with 20', function (done) {

        sandbox.stub(query, 'exec').returns(q.resolve(surveyData));

        request(app)
          .get('/?i=20')
          .expect(200)
          .expect(function (response) {

            expect(query.limit.getCall(0).args[0]).to.be.equals(config.pageSize);
            expect(query.sort.getCall(0).args[0].closeDate).to.be.equals(-1);
            expect(query.skip.getCall(0).args[0]).to.be.equals(20);
            expect(response.body.length).to.be.equals(surveyData.length);

          })
          .end(done);

      });

      it ('returns 204 when no data is found', function (done) {

        sandbox.stub(query, 'exec').returns(q.resolve([]));

        request(app)
          .get('/?i=999999')
          .expect(204)
          .expect(function (response) {

            expect(query.limit.getCall(0).args[0]).to.be.equals(config.pageSize);
            expect(query.sort.getCall(0).args[0].closeDate).to.be.equals(-1);
            expect(query.skip.getCall(0).args[0]).to.be.equals(999999);
            expect(response.body.length).to.be.undefined;

          })
          .end(done);

      });

      it ('returns 500 when mongo throws an error', function (done) {

        sandbox.stub(query, 'exec').returns(q.reject(new Error('mongoError')));

        request(app)
          .get('/?i=999999')
          .expect(500)
          .expect(function (response) {

            expect(query.limit.getCall(0).args[0]).to.be.equals(config.pageSize);
            expect(query.sort.getCall(0).args[0].closeDate).to.be.equals(-1);
            expect(query.skip.getCall(0).args[0]).to.be.equals(999999);
            expect(response.body.message).to.be.equals('mongoError');

          })
          .end(done);

      });

    });

    describe('detail', function () {

      beforeEach(function () {

        sandbox.spy(Survey, 'findOne');
        app.use(addLogger, surveyController.router, errorHandler);

      });

      it ('returns 200 with data', function (done) {

        sandbox.stub(query, 'exec').returns(q.resolve(surveyData[0]));

        request(app)
          .get('/eeeeeeef0000000f00001111')
          .expect(200)
          .expect(function (response) {

            expect(Survey.findOne.getCall(0).args[0]._id).to.be.equals('eeeeeeef0000000f00001111');
            expect(Survey.findOne.getCall(0).args[1].votes).to.be.equals(0);
            expect(Survey.findOne.getCall(0).args[1].posts).to.be.equals(0);
            expect(response.body._id.toString()).to.be.equals(surveyData[0]._id);

          })
          .end(done);

      });

      it ('returns 404 with no data when called with wrong id', function (done) {

        sandbox.stub(query, 'exec').returns(q.resolve());

        request(app)
          .get('/0000000f0000000f00000000')
          .expect(404)
          .expect(function (response) {

            expect(Survey.findOne.getCall(0).args[0]._id).to.be.equals('0000000f0000000f00000000');
            expect(response.body.message).to.be.equals('notFound');

          })
          .end(done);

      });

      it ('returns 500 when mongo throws an error', function (done) {

        sandbox.stub(query, 'exec').returns(q.reject(new Error('mongoError')));

        request(app)
          .get('/eeeeeeef0000000f00001111')
          .expect(500)
          .expect(function (response) {

            expect(Survey.findOne.calledOnce).to.be.true;
            expect(response.body.message).to.be.equals('mongoError');

          })
          .end(done);

      });

    });

    describe('post', function () {

      beforeEach(function () {

        sandbox.spy(Survey, 'findOne');
        app.use(addLogger, addUser(new User(userData[0])), surveyController.router, errorHandler);

      });

      it ('returns 201 with the new post', function (done) {

        var message = Math.random() + ' ' + Date.now();
        var added = false;

        sandbox.stub(Survey.prototype, 'save', function (callback) {

          added = this.posts.filter(function (post) {
            return message === post.message;
          }).length > 0;
          callback(null, new Survey(surveyData[0]));

        });

        sandbox.stub(query, 'exec').returns(q.resolve(new Survey(surveyData[0])));

        request(app)
        .post('/eeeeeeef0000000f00001111/posts')
        .send({ message: message })
        .expect(201)
        .expect(function (response) {

          expect(Survey.findOne.getCall(0).args[0]._id).to.be.equals('eeeeeeef0000000f00001111');
          expect(response.body.message).to.be.deep.equals(message);
          expect(added).to.be.true;
          expect(Survey.prototype.save.called).to.be.true;

        })
        .end(done);

      });

      it ('returns 404 when the id is invalid', function (done) {

        sandbox.spy(Survey.prototype, 'save');
        sandbox.stub(query, 'exec').returns(q.resolve(null));

        request(app)
        .post('/eeeeeeef0000000feeeeeeee/posts')
        .send({ message: 'Bla bla bla' })
        .expect(404)
        .expect(function (response) {

          expect(Survey.findOne.getCall(0).args[0]._id).to.be.equals('eeeeeeef0000000feeeeeeee');
          expect(Survey.prototype.save.called).to.be.false;

        })
        .end(done);

      });

      it ('returns 500 when find throws an error', function (done) {

        sandbox.stub(Survey.prototype, 'save').yields(new Error('mongoSaveError'));
        sandbox.stub(query, 'exec').returns(q.resolve(new Survey(surveyData[0])));

        request(app)
        .post('/eeeeeeef0000000feeeeeeee/posts')
        .send({ message: 'Bla bla bla' })
        .expect(500, { message: 'mongoSaveError' })
        .end(done);

      });

      it ('returns 500 when find throws an error', function (done) {

        sandbox.spy(Survey.prototype, 'save');
        sandbox.stub(query, 'exec').returns(q.reject(new Error('mongoFindError')));

        request(app)
        .post('/eeeeeeef0000000feeeeeeee/posts')
        .send({ message: 'Bla bla bla' })
        .expect(500, { message: 'mongoFindError' })
        .end(done);

      });

      it ('returns 400 when no message is passed', function (done) {

        request(app)
        .post('/eeeeeeef0000000feeeeeeee/posts')
        .expect(400)
        .end(done);

      });

      it ('returns 400 when the survey is not active', function (done) {

        var message = Math.random() + ' ' + Date.now();
        var expiredSurvey = new Survey(surveyData[1]);

        expiredSurvey.openDate = Date.now() - 3 * 24 * 3600 * 1000;
        expiredSurvey.closeDate = Date.now() - 1 * 24 * 3600 * 1000;

        sandbox.spy(Survey.prototype, 'save');
        sandbox.stub(query, 'exec').returns(q.resolve(expiredSurvey));

        request(app)
        .post('/eeeeeeef0000000f00002222/posts')
        .send({ message: message })
        .expect(400)
        .expect(function (response) {
          expect(Survey.prototype.save.called).to.be.false;
        })
        .end(done);

      });

    });

    describe('getPosts', function () {

      var survey;

      beforeEach(function () {

        sandbox.spy(Survey, 'findOne');
        app.use(addLogger, surveyController.router, errorHandler);
        survey = new Survey(surveyData[0]);

      });

      it ('returns 200 with data from 0 whe no i is passed', function (done) {

        sandbox.stub(query, 'exec').returns(q.resolve(survey));

        request(app)
          .get('/eeeeeeef0000000f00001111/posts')
          .expect(200)
          .expect(function (response) {

            expect(Survey.findOne.getCall(0).args[0]._id).to.be.equals('eeeeeeef0000000f00001111');
            expect(Survey.findOne.getCall(0).args[1].posts.$slice[0]).to.be.equals(-config.pageSize);
            expect(Survey.findOne.getCall(0).args[1].posts.$slice[1]).to.be.equals(config.pageSize);
            //expect(response.body).to.be.deep.equals(survey.posts);

          })
          .end(done);

      });

      it ('returns 200 with data with data from i', function (done) {

        survey.posts = [ { _id: 'aaaaaaaf0000000f00001111' } ]
        sandbox.stub(query, 'exec').returns(q.resolve(survey));

        request(app)
          .get('/eeeeeeef0000000f00001111/posts?i=20')
          .expect(200)
          .expect(function (response) {

            expect(Survey.findOne.getCall(0).args[0]._id).to.be.equals('eeeeeeef0000000f00001111');
            expect(Survey.findOne.getCall(0).args[1].posts.$slice[0]).to.be.equals(-20);
            expect(Survey.findOne.getCall(0).args[1].posts.$slice[1]).to.be.equals(config.pageSize);

          })
          .end(done);

      });

      it ('returns 204 when no data is retrieved empty array', function (done) {

        survey.posts = [];
        sandbox.stub(query, 'exec').returns(q.resolve(survey));

        request(app)
          .get('/eeeeeeef0000000f00001111/posts?i=20')
          .expect(204)
          .expect(function (response) {
            expect(response.body).to.be.empty;
          })
          .end(done);

      });

      it ('returns 404 with no data when called with wrong id', function (done) {

        sandbox.stub(query, 'exec').returns(q.resolve());

        request(app)
          .get('/0000000f0000000f00000000')
          .expect(404)
          .expect(function (response) {

            expect(Survey.findOne.getCall(0).args[0]._id).to.be.equals('0000000f0000000f00000000');
            expect(response.body.message).to.be.equals('notFound');

          })
          .end(done);

      });

      it ('returns 500 when mongo throws an error', function (done) {

        sandbox.stub(query, 'exec').returns(q.reject(new Error('mongoError')));

        request(app)
          .get('/eeeeeeef0000000f00001111')
          .expect(500)
          .expect(function (response) {

            expect(Survey.findOne.calledOnce).to.be.true;
            expect(response.body.message).to.be.equals('mongoError');

          })
          .end(done);

      });

    });



  });

})();

