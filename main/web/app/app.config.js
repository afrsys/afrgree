(function () {

  'use strict';

  angular
    .module('afrgree')
    .config(config);

  function config($stateProvider, $urlRouterProvider, $httpProvider, loadingProvider) {

    $urlRouterProvider.otherwise('/index');

    $stateProvider
    .state('index', {
      url: '/index',
      templateUrl: 'app/index.html',
      access: {
        requiredLogin: false
      }
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/dashboard.html',
      access: {
        requiredLogin: true
      }
    });

    $httpProvider.interceptors.push('loadingHttpInterceptor');

    loadingProvider.config({
      parent: '.workspace',
      showSpinner: false
    });

  }

})();
