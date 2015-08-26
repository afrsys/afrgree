(function () {

  'use strict';

  var mongoose = require('mongoose');
  var Q = require('q');

  function connect(url) {

    var deferred = Q.defer();

    if (url !== mongoose.connection.name) {
      dropAndClose();
    }

    if (mongoose.connection.readyState === 0) {

      mongoose.connect(url, function (err) {

        if (!err) {
          deferred.resolve();
        } else {
          deferred.reject(err);
        }

      });

    }
  
    return deferred.promise;
  
  }

  function clear() {
    
    var promises = [];
    
    for (var i = 0; i <= mongoose.connection.collections.length; i++) {
      promises.push(mongoose.connection.collections[i].remove);
    }
   
    return Q.all(promises);

  }

  function dropAndClose() {

    if (mongoose.connection.readyState !== 0) {

      mongoose.connection.db.dropDatabase();
      mongoose.disconnect();

    }

  }

  module.exports = {
    connect: connect,
    clear: clear,
    dropAndClose: dropAndClose
  };
  
})();
