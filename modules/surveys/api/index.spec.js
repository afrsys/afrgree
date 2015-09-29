/*'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var supertest = require('supertest');
var api = require('./index.js');
var config = require('../../../config')
var security = require('../../users/api/security');
var User = require('../../users/api/User');
var Survey = require('./Survey');
var q = require('q');
var surveyData = require('../../../test/data/surveys');*/
//var testServer = require('../../../test/TestServer')(api);
//var app = testServer.app;
//var mongoStub = require('../../../test/mongoStub');
/*
describe.skip('/surveys/api', function () {

  var sandbox, token;

  after(testServer.close);

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
     security.issueToken('homer@simpsons.com', '1234', testServer.logger),
     Survey.remove({}),
     Survey.create(surveyData)
    ])
    .then(function (data) {
      token = 'Bearer ' + data[2].token;
      done();
    });

  });

  afterEach(function () {
    sandbox.restore()
  });

  describe.only('GET/', function () {
    
    it('Returns 200 with only pagesize registers', function (done) {

      supertest(app)
      .get('/api')
      .expect(200)
      .expect(function (res) {
        expect(res.body.length).to.be.equals(20);
        expect(res.body[0]._id.toString()).to.be.equals('eeeeeeef0000000f00000000');
        expect(res.body[1]._id.toString()).to.be.equals('eeeeeeef0000000f00001111');
      })
      .end(done);

    });

    it('Returns 204 with no data', function (done) {

      Survey.remove({}).then(function () {

        supertest(app)
        .get('/api')
        .expect(204, [])
        .end(done);

      });
      
    });

    it('Returns 200 with skiping some registers', function (done) {

      supertest(app)
      .get('/api?i=1')
      .expect(200)
      .expect(function (res) {
        expect(res.body.length).to.be.equals(20);
        expect(res.body[0]._id.toString()).to.be.equals('eeeeeeef0000000f00001111');
      })
      .end(done);

    });

    it('Returns 500 when mongo throws an error', function (done) {

      mongoStub.queryError(Survey, 'mongoError', sandbox);
      
      supertest(app)
      .get('/api')
      .expect(500, { message: 'mongoError' })
      .end(done);

    });

    


  });

});*/
