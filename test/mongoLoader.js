'use strict';

var q = require('q');

module.exports = function (Model, data, logger) {

  var deferred = q.defer();

  logger = logger || require('./logger');
  
  Model.remove({})
  .then(function (removed) {
    
    logger.info(' Removed (' + removed.result.n + '): ' + Model.name);
    Model.create(data).then(function (created) {

      logger.info(' Created (' + created.length + '): ' + Model.name);
      deferred.resolve();

    }, deferred.reject);

  }, deferred.reject);

  return deferred.promise;

}
