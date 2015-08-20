(function () {

  'use strict';
  angular
    .module('afrgree.surveys')
    .controller('SurveyCreateCtrl', SurveyCreateCtrl);

  function SurveyCreateCtrl($state) {
  
    var ctrl = this;
  
    ctrl.title = null;
    ctrl.description = null;

    ctrl.create = function () {

      console.log({ title: this.title, description: this.description });
      $state.go('surveys.list');

    };

  }
	
})();
