(function () {

  'use strict';

  angular
  .module('afrgree')
  .directive('afrgreeAlert', function () {

    var drtv = {};

    drtv.templateUrl = '/alert.html';
    drtv.restrict = 'E';
    drtv.controller = 'AlertCtrl';
    drtv.controllerAs = 'alertCtrl';

    return drtv;

  });

})();
