(function () {

  'use strict';

  angular
  .module('afrgree')
  .controller('ConfirmDialogController', function ($modalInstance, data) {

    var ctrl = this;
    
    ctrl.data = data;
    ctrl.ok = $modalInstance.close;
    ctrl.cancel = $modalInstance.dismiss;

    return ctrl;

  });

})();
