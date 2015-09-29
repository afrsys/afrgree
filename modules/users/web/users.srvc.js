(function () {

  'use strict';

  angular
  .module('afrgree.users')
  .factory('users', function ($http) {

    var srvc = this;

    srvc.passwordAuth = function (email, password) {
      return $http.post('/users/api/auth/password', { 
        mail: email, password: password
      });
    };

    srvc.changePassword = function (oldPassword, newPassword) {
      return $http.put('/users/api/auth/password/', {
        oldPassword: oldPassword, newPassword: newPassword
      });
    };

    return srvc;

  });

})();
