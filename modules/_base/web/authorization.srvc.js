'use strict';

angular
.module('afrgree')
.factory('authorization', function ($rootScope, principal) {

  return {
    authorize: authorize
  };

  function authorize() {

    principal.identity();

    var isAuthenticated = principal.isAuthenticated();
    var access = $rootScope.toState.access;

    if (access.requiredLogin) {

      if (access.roles) {
        if (!principal.isInAnyRole(access.roles)) {
          if (isAuthenticated) {

            return 'unauthorized';

          } else {

            $rootScope.returnToState = $rootScope.toState;
            $rootScope.returnToStateParams = $rootScope.toStateParams;
            return 'unauthenticated';

          }
        }

      } else {

        if (!isAuthenticated) {

          $rootScope.returnToState = $rootScope.toState;
          $rootScope.returnToStateParams = $rootScope.toStateParams;
          return 'unauthenticated';

        }
      }

    }
    return 'authorized';

  }

});
