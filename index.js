'use strict';

var cluster = require('cluster');

if (cluster.isMaster) {

  var cpus = require('os').cpus().length;

  for (var i = 0; i < cpus; i += 1) {
    cluster.fork();
  }

} else {

  var server = require('./core/server');
  
  server.start();

}
