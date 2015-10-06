'use strict';

var q = require('q');
var security = require('../modules/users/api/security')

module.exports = function (username, password, tokenLifetime, logger) {

  return function () {

    var deferred = q.defer();

    tokenLifetime = tokenLifetime || 86400000;
    logger = logger || require('./logger');
    
    security.issueToken(username, password, tokenLifetime , logger)
    .then(function (data) {
      deferred.resolve('Bearer ' + data.token);
    }, deferred.reject);

    return deferred.promise;

  };

};
