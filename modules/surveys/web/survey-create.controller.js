(function () {

  'use strict';
  angular
    .module('afrgree.surveys')
    .controller('SurveyCreateCtrl', SurveyCreateCtrl);

  function SurveyCreateCtrl($state, alertService, surveysService) {
  
    var ctrl = this;
  
    ctrl.title = null;
    ctrl.description = null;

    ctrl.create = function () {

      surveysService.create(this.title, this.description, Date.now() + (7 * 24 * 3600 * 1000))
      .then(function () {

        alertService.info('Pesquisa criada.');
        $state.go('surveys.list');

      }).catch(function (error) {

        console.log(error);
        alertService.error('Não foi possível criar a pesquisa.');
      
      });

    };

  }
	
})();
