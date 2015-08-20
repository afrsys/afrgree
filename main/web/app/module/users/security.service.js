(function () {

  'use strict';

  angular
    .module('afrgree.users')
    .factory('securityService', SecurityService);

  function SecurityService($http) {

    var srvc = this;

    srvc.passwordAuth = function (email, password) {
      return $http.post('/api/security/auth/password', { email: email, password: password });
    };

    return srvc;

  }

})();
