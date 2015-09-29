'use strict';

angular
.module('afrgree', [
  'ui.bootstrap',
  'ngSanitize',
  'ngAnimate',
  'ngFx',
  'ui.router',
  'afrgree.users',
  'afrgree.surveys'
])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider, loadingProvider,
    jwtInterceptorProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '/home.html',
    access: {
      requiredLogin: false
    }
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: '/dashboard.html',
    access: {
      requiredLogin: true
    }
  });
  
  $httpProvider.interceptors.push('jwtInterceptor');
  jwtInterceptorProvider.tokenGetter = tokenGetter;

  tokenGetter.$inject = ['config', 'principal'];
  function tokenGetter(config, principal) {

    var isApi = /\/api[./]/;

    if (isApi.test(config.url)) {

      var identity = principal.identity();

      if (identity) {
        return identity.token;
      }
      return null;

    }
    return null;

  }

  $httpProvider.interceptors.push('loadingHttpInterceptor');
  loadingProvider.config({
    parent: '.workspace',
    showSpinner: false
  });

});
