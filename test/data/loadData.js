(function () {

  'use strict';

  var config = require('../../main/api/config');
  var mongoose = require('mongoose');
  var q = require('q');
  
  function removeAndCreate(model, data) {
 
    var deferred = q.defer();
    var Model = require('../../main/api/modules' + model);

    Model.remove({}).then(function (removed) {
      
      console.log(' Removed (' + removed.result.n + '): ' + model);
      Model.create(require(data)).then(function (created) {

        console.log(' Created (' + created.length + '): ' + model);
        deferred.resolve();

      }, deferred.reject);

    }, deferred.reject);

    return deferred.promise;

  }

  mongoose.connect.call(mongoose, config.databaseUrl);

  mongoose.connection.on('connected', function () {

    console.log('Mongoose: connected', config);
    q.all([
      removeAndCreate('/surveys/Survey', './surveys'),
      removeAndCreate('/users/User', './users'),
    ]).catch(function (err) {
      console.log(err);
    }).finally(function () {

      console.log('Mongoose: closing connection');
      mongoose.disconnect();

    });

  });

  mongoose.connection.on('error', function (err) {

    console.log('Mongoose: error');
    console.log(err);
    process.exit(1);

  });

})();

