'use strict';

angular
.module('afrgree.users', [
  'ui.router',
  'angular-storage',
  'angular-jwt'
])
.config(function ($stateProvider) {

  $stateProvider
  .state('users', {
    abstract: true,
    url: '/users',
    template: '<ui-view/>'
  })
  .state('users.auth', {
    url: '/auth',
    templateUrl: '/modules/users/auth.html',
    access: {
      requiredLogin: false
    }
  })
  .state('users.change-password', {
    url: '/change-password',
    templateUrl: '/modules/users/change-password.html',
    access: {
      requiredLogin: true
    }
  });

})
.run(function ($rootScope, $state, authorization, principal) {

  $rootScope.$on('unauthenticated', function () {

    principal.authenticate();
    $state.go('users.auth');

  });
  $rootScope.$on('unauthorized', function () {

    $state.go('index');

  });
  $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {

    $rootScope.toState = toState;
    $rootScope.toStateParams = toStateParams;

    // return 'authorized' or 'unauthorized' or 'unauthenticated'
    var auth = authorization.authorize();

    if (auth !== 'authorized') {

      event.preventDefault();
      $rootScope.$emit(auth);

    }

  });

});
