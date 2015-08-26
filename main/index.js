(function () {

  'use strict';

  var cluster = require('cluster');
  var cpus = require('os').cpus().length;

  cluster.setupMaster({ exec: __dirname + '/api/server.js'});
  for (var i = 0; i < cpus; i++) {
    cluster.fork();
  }

})();
