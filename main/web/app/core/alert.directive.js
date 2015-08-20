(function () {

  'use strict';

  angular
    .module('afrgree.core')
    .directive('afrgreeAlert', alertDirective);

  function alertDirective() {

    var drtv = {};

    drtv.templateUrl = 'app/core/alert.html';
    drtv.restrict = 'E';
    drtv.controller = 'AlertController';
    drtv.controllerAs = 'alertCtrl';

    return drtv;

  }

})();
