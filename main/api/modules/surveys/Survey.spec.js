(function () {
  
  'use strict';
  /*jshint expr: true*/
  var expect = require('chai').expect;
  var Survey = require('./Survey.js');
  var surveyData = require('../../../../test/data/surveys');

  describe('Survey', function () {

    it('exists', function () {
      expect(Survey).to.exists;
    });

    describe('vote', function () {

      it ('Adds the vote if it does not exists', function () {
        
        var survey = new Survey(surveyData[0]);
        var votesLength = survey.votes.length;
        var vote = survey.vote('aaaaaaaf0000000f00002222', true);

        expect(survey.votes.length).to.be.equals(votesLength + 1);
        expect(vote.user.toString()).to.be.equals('aaaaaaaf0000000f00002222');
        expect(vote.option).to.be.true;

      });

      it ('Changes the vote if it exists', function () {
        
        var survey = new Survey(surveyData[0]);
        var votesLength = survey.votes.length;
        var vote = survey.vote('aaaaaaaf0000000f00001111', 'Test');

        expect(survey.votes.length).to.be.equals(votesLength);
        expect(vote.user.toString()).to.be.equals('aaaaaaaf0000000f00001111');
        expect(vote.option).to.be.equals('Test');

      });

    });

  });

})();
