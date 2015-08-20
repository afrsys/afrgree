(function () {

  'use strict';

  angular
    .module('afrgree.surveys')
    .config(config);

  function config($stateProvider) {

    $stateProvider
    .state('surveys', {
      abstract: true,
      url: '/surveys',
      template: '<ui-view/>',
      access: {
        requiredLogin: true
      }
    })
    .state('surveys.list', {
      url: '/',
      templateUrl: 'app/module/surveys/survey-list.html',
      controller: 'SurveyListCtrl as surveyListCtrl',
      resolve:{
        surveyListPromise: function (surveysService) {
          return surveysService.list();
        }
      }
      
    })
    .state('surveys.create', {
      url: '/create',
      templateUrl: 'app/module/surveys/survey-create.html',
      controller: 'SurveyCreateCtrl as surveyCreateCtrl',
    })
    .state('surveys.detail', {
      url: '/{id}',
      templateUrl: 'app/module/surveys/survey-detail.html',
      controller: 'SurveyDetailCtrl as surveyDetailCtrl',
      resolve: {
        surveyPromise: function ($stateParams, surveysService) {
          return surveysService.detail($stateParams.id);
        }
      }
    });

  }

})();

