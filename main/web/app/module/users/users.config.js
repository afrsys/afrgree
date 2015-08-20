(function () {

  'use strict';

  angular
    .module('afrgree.users')
    .config(config);

  function config($stateProvider, $httpProvider, jwtInterceptorProvider) {

    $stateProvider
    .state('users', {
      abstract: true,
      url: '/users',
      template: '<ui-view/>'
    })
    .state('users.auth', {
      url: '/auth',
      templateUrl: 'app/module/users/auth.html',
      access: {
        requiredLogin: false
      }
      /*})
    .state('security.changePassword', {
      url: '/changePassword',
      templateUrl: 'app/security/change-password.html',
      access: {
        requiredLogin: true
      }*/
    });

    jwtInterceptorProvider.tokenGetter = tokenGetter;
    $httpProvider.interceptors.push('jwtInterceptor');

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

  }

})();

