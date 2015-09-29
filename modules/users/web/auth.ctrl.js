'use strict';

angular
.module('afrgree.users')
.controller('AuthController', function (users, alertService, principal, $state) {

  var ctrl = this;

  ctrl.email = null;
  ctrl.password = null;

  ctrl.passwordLogin = function () {

    users.passwordAuth(ctrl.email, ctrl.password)
    .then(function success (res) {

      principal.authenticate(res.data);
      $state.go('dashboard');

    }, function error (res) {
      
      var message = null;

      switch (res.status) {
        case 401:
          message = 'Usuário ou senha incorretos.';
          break;
        default:
          console.log(error.status, error.data);
          message = 'Não foi possível efetuar autenticação no servidor.';
          break;
      }

      alertService.error(message);

    });
    
  };

  ctrl.logout = function () {

    principal.authenticate(null);
    $state.go('home');

  };

  return ctrl;

});
