'use strict';

angular
.module('afrgree.users')
.controller('ChangePasswordCtrl', function (users, alertService) {

  var ctrl = this;

  ctrl.oldPassword = null;
  ctrl.newPassword = null;
  ctrl.newPasswordVerification = null;

  ctrl.changePassword = function () {

    if (ctrl.newEmail === ctrl.newEmailVerification) {
      users.changePassword(ctrl.oldPassword, ctrl.newPassword)
      .success(function (data, status) {

        alertService.success('Senha alterada');
        ctrl.oldPassword = null;
        ctrl.newPassword = null;
        ctrl.newPasswordVerification = null;
        
      })
      .error(function (data, status) {
        alertService.error('Não foi possível alterar a senha.', data);
      });
    } else {
      alertService.error('A nova senha e a verificação não conferem.');
    }

  };

  return ctrl;

});
