(function () {

  'use strict';

  angular
    .module('afrgree.core')
    .factory('alertService', alertService);

  function alertService($timeout) {

    var srvc = {
      add: add,
      dismiss: dismiss,
      success: success,
      info: info,
      warning: warning,
      error: error,
      alerts: []
    };

    function success(message) {
      add('success', message);
    }

    function info(message) {
      add('info', message);
    }

    function warning(message) {
      add('warning', message);
    }

    function error(message, err) {

      if (err) {
        console.log(err);
      }

      add('danger', message);

    }

    function add(type, message) {

      var item = {
        type: type,
        message: message
      };

      item.timeout = $timeout(function () { dismiss(item); }, 5000);
      srvc.alerts.push(item);

    }

    function dismiss(item) {

      var index;

      if (typeof item === 'object') {

        index = srvc.alerts.indexOf(item);

      } else {

        index = item;
        item = srvc.alerts[index];

      }

      $timeout.cancel(item.timeout);
      srvc.alerts.splice(index, 1);

    }

    return srvc;

  }

})();
