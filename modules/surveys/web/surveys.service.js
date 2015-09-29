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

    srvc.create = function (title, description, closeDate) {
      return $http.post('/api/surveys/', {
        title: title,
        description: description,
        closeDate: closeDate
      });
    };

    srvc.detail = function (id) {
      return $http.get('/api/surveys/' + id);
    };

    srvc.post = function (id, message) {
      return $http.post('/api/surveys/' + id + '/posts', { message: message });
    };

    srvc.getPosts = function (id, index) {
      return $http.get('/api/surveys/' + id + '/posts?i=' + index);
    };

    srvc.getNewestPosts = function (id, time) {
      return $http.get('/api/surveys/' + id + '/posts/' + (time || 0));
    };

    return srvc;

  }

})();
