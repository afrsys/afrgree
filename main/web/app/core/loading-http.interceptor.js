(function () {

  'use strict';

  angular.module('afrgree.core')
    .factory('loadingHttpInterceptor', loadingHttpInterceptor);

  function loadingHttpInterceptor($q, loading) {

    return {
      request: start,
      requestError: reject,
      response: done,
      responseError: reject
    };

    function start(config) {

      loading.start();
      return config;

    }

    function done(config) {

      loading.done();
      return config;

    }

    function reject(rejection) {

      loading.done();
      return $q.reject(rejection);

    }

  }

})();
