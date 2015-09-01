(function () {
  
  'use strict';
  /*jshint expr: true*/
  var expect = require('chai').expect;
  var Survey = require('./Survey.js');
  var surveyData = require('../../../../test/data/surveys');
  var _ = require('lodash');

  describe.only('Survey', function () {

    describe('vote', function () {

      describe ('Simple', function () {

        it ('Adds the vote if it does not exists', function () {
          
          var survey = new Survey(surveyData[0]);
          var vote = null;
          var option = null;
          
          expect(_.filter(survey.ballot, { option: 'True' })).to.be.empty;
          vote = survey.vote('aaaaaaaf0000000f00002222', 'True');
          option = _.find(survey.ballot, { option: 'True' });
          expect(option).to.not.be.defined;
          expect(vote).to.be.true;
          expect(_.find(option.votes, { user: 'aaaaaaaf0000000f00002222'})).to.be.defined;



        });

        it ('Changes the vote if it exists False', function () {
          
          var survey = new Survey(surveyData[0]);
          var vote = null;
          var TrueOption = null;
          var FalseOption = null;
          
          expect(_.filter(survey.ballot, { option: 'True' })).to.be.empty;
          vote = survey.vote('aaaaaaaf0000000f00001111', 'True');
          TrueOption = _.find(survey.ballot, { option: 'True' });
          FalseOption = _.find(survey.ballot, { option: 'False' });
          expect(vote).to.be.true;
          expect(_.find(TrueOption.votes, { user: 'aaaaaaaf0000000f00001111'})).to.be.defined;
          expect(_.find(FalseOption.votes, { user: 'aaaaaaaf0000000f00001111'})).to.be.undefined;

        });

        it ('Changes the vote if it exists Abstent', function () {
          
          var survey = new Survey(surveyData[0]);
          var vote = null;
          var TrueOption = null;
          var FalseOption = null;
          var AbstentOption = null;
          
          expect(_.filter(survey.ballot, { option: 'Abstent' })).to.be.empty;
          vote = survey.vote('aaaaaaaf0000000f00001111', 'Abstent');
          FalseOption = _.find(survey.ballot, { option: 'False' });
          AbstentOption = _.find(survey.ballot, { option: 'Abstent' });
          expect(vote).to.be.true;
          expect(_.find(survey.ballot, { option: 'True' })).to.be.undefined;
          expect(_.find(AbstentOption.votes, { user: 'aaaaaaaf0000000f00001111'})).to.be.defined;
          expect(_.find(FalseOption.votes, { user: 'aaaaaaaf0000000f00001111'})).to.be.undefined;

        });

        it ('Rejects the vote if it is Invalid', function () {
          
          var survey = new Survey(surveyData[0]);
          var vote = null;
          
          vote = survey.vote('aaaaaaaf0000000f00001111', 'WrongOption');
          expect(vote).to.be.false;

        });

        

      });
      

    });

  });

})();
