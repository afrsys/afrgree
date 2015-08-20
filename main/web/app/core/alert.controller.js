(function () {

  'use strict';

  angular
    .module('afrgree.core')
    .controller('AlertController', AlertController);

  function AlertController(alertService) {

    var ctrl = this;

    ctrl.alerts = alertService.alerts;
    ctrl.dismiss = alertService.dismiss;

    return ctrl;

  }

})();
