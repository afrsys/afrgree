(function () {

  'use strict';

  angular
    .module('afrgree.surveys')
    .factory('surveysService', SurveysService);

  function SurveysService($http) {

    var srvc = this;

    srvc.list = function (i) {
      return $http.get('/api/surveys/?i=' + i);
    };

    srvc.detail = function (id) {
      return $http.get('/api/surveys/' + id);
    };

    srvc.post = function (id, message) {
      return $http.post('/api/surveys/' + id + '/post', { message: message });
    };

    return srvc;

  }

})();
