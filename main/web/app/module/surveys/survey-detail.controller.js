(function () {

  'use strict';
  angular
    .module('afrgree.surveys')
    .controller('SurveyDetailCtrl', SurveyDetailCtrl);

  function SurveyDetailCtrl($stateParams, surveyPromise, _) {

    var ctrl = this;
    
    ctrl.survey = surveyPromise.data;
    ctrl.isActive = new Date(ctrl.survey.closeDate).getTime(), Date.now();
    if (ctrl.isActive) {
      ctrl.result = countVotes(ctrl.survey.votes);
    }
  
    function countVotes(votes) {

      var activeCount = 0;
      var retiredCount = 0;
      var count = votes.length;
      var result = {
        total: 0,
        active: 0,
        retired: 0
      };

      _(votes).forEach(function (vote) {
        if (vote.type === 'active') {

          if (vote.option === true) {

            result.total++;
            result.active++;

          }
          activeCount++;

        } else {

          if (vote.option === true) {

            result.total++;
            result.retired++;

          }
          retiredCount++;

        }
      }).value();

      if (count) { result.total /= count; }
      if (activeCount) { result.active /= activeCount; }
      if (retiredCount) { result.retired /= retiredCount; }
      
      return result;
      
    }

  }

})();
