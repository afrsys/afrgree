(function () {

  'use strict';

  angular
  .module('afrgree')
  .controller('AlertCtrl', function (alertService) {

    var ctrl = this;

    ctrl.alerts = alertService.alerts;
    ctrl.dismiss = alertService.dismiss;

    return ctrl;

  });

})();
