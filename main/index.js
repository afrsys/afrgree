(function () {

  'use strict';
  console.log('A');
  var cluster = require('cluster');
  var server = require('./api/server');

  if (cluster.isMaster) {

    var cpus = require('os').cpus().length;

    for (var i = 0; i < cpus; i += 1) {
        cluster.fork();
    }

  } else {
console.log('X');
    server.run();

  }

})();
