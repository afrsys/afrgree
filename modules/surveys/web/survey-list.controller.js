(function () {

  'use strict';
  angular
    .module('afrgree.surveys')
    .controller('SurveyListCtrl', SurveyListCtrl);

  function SurveyListCtrl(surveyListPromise) {
    
    var ctrl = this;
    
    ctrl.list = surveyListPromise.data;

  }
	
})();
