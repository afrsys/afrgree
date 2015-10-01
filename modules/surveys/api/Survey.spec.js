(function () {
  
  'use strict';
  /*jshint expr: true*/
  var expect = require('chai').expect;
  var ObjectId = require('mongoose').Types.ObjectId;
  var Survey = require('./Survey.js');
  var surveyData = require('../../../test/data/surveys');
  var _ = require('lodash');

  describe('Survey', function () {

    describe('vote', function () {

      describe('Simple', function () {

        it('Adds the vote if it does not exists', function () {
          
          var survey = new Survey(surveyData[0]);
          var vote = null;
          var option = _.find(survey.ballot, { option: 'True' });
          
          expect(option.votes.length).to.be.equals(3);
          vote = survey.vote('aaaaaaaf0000000f00002222', 'True');
          expect(vote).to.be.true;
          expect(option.votes.length).to.be.equals(4);

        });

        it('Changes the vote if it exists False', function () {
          
          var survey = new Survey(surveyData[0]);
          var vote = null;
          var TrueOption = _.find(survey.ballot, { option: 'True' });
          var FalseOption = _.find(survey.ballot, { option: 'False' });
          var userId = new ObjectId('aaaaaaaf0000000f00001111');
          
          expect(TrueOption.votes.length).to.be.equals(3);
          expect(FalseOption).to.be.undefined;
          vote = survey.vote('aaaaaaaf0000000f00001111', 'False');
          expect(vote).to.be.true;
          FalseOption = _.find(survey.ballot, { option: 'False' });
          expect(TrueOption.votes.length).to.be.equals(2);
          expect(FalseOption.votes.length).to.be.equals(1);
          expect(_.filter(TrueOption.votes, { user: userId }).length).to.be.equals(0);
          expect(_.filter(FalseOption.votes, { user: userId }).length).to.be.equals(1);

        });

        it('Changes the vote if it exists Abstent', function () {
          
          var survey = new Survey(surveyData[0]);
          var vote = null;
          var TrueOption = _.find(survey.ballot, { option: 'True' });
          var AbstentOption = _.find(survey.ballot, { option: 'Abstent' });
          var userId = new ObjectId('aaaaaaaf0000000f00001111');
          
          expect(TrueOption.votes.length).to.be.equals(3);
          expect(AbstentOption).to.be.undefined;
          vote = survey.vote('aaaaaaaf0000000f00001111', 'Abstent');
          expect(vote).to.be.true;
          AbstentOption = _.find(survey.ballot, { option: 'Abstent' });
          expect(TrueOption.votes.length).to.be.equals(2);
          expect(AbstentOption.votes.length).to.be.equals(1);
          expect(_.filter(TrueOption.votes, { user: userId }).length).to.be.equals(0);
          expect(_.filter(AbstentOption.votes, { user: userId }).length).to.be.equals(1);

        });

        it('Rejects the vote if it is Invalid', function () {
          
          var survey = new Survey(surveyData[0]);
          var vote = null;
          
          vote = survey.vote('aaaaaaaf0000000f00001111', 'WrongOption');
          expect(vote).to.be.false;

        });

      });

    });

  });

})();
