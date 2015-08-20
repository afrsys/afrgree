(function () {

  'use strict';

  angular
    .module('afrgree.core')
    .factory('_', lodashService);

  function lodashService ($window) {
    return $window._;
  }

})();
