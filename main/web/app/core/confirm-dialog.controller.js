(function () {

  'use strict';

  angular
    .module('afrgree.core')
    .controller('ConfirmDialogController', ConfirmDialogController);

  function ConfirmDialogController($modalInstance, data) {

    var ctrl = this;
    
    ctrl.data = data;
    ctrl.ok = $modalInstance.close;
    ctrl.cancel = $modalInstance.dismiss;

    return ctrl;

  }

})();
