(function () {

  'use strict';
  angular
    .module('afrgree.users')
    .controller('AuthController', AuthController);

  function AuthController(securityService, alertService, principal, $state) {

    var ctrl = this;

    ctrl.email = null;
    ctrl.password = null;

    ctrl.passwordLogin = function (event) {

      securityService.passwordAuth(ctrl.email, ctrl.password)
      .then(function (res) {

        principal.authenticate(res.data);
        $state.go('surveys.list');

      })
      .catch(function (res) {
        
        var message = null;
        
        switch (res.status){
          case 400:
            message = 'Usuário ou senha incorretos.';
            break;
          default:
            message = 'Não foi possível efetuar autenticação no servidor.';
            break;
        }
        alertService.error(message);

      });

    };

    ctrl.logout = function () {

      principal.authenticate(null);
      $state.go('index');

    };

    return ctrl;

  }

})();
