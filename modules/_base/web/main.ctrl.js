'use strict';

angular
.module('afrgree')
.controller('MainCtrl', function (principal, $scope) {

  var ctrl = this;

  ctrl.principal = principal;
  return ctrl;

});
