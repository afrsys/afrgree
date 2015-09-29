'use strict';

var mongoose = require('mongoose');

/*

  Important!
  Mongoose buffers all the commands until it's connected to the database.
  This means that you don't have to wait until it connects to MongoDB in order
  to define models, run queries, etc.

  connecting: Emitted when connection.{open,openSet}() is executed on this connection.

  connected: Emitted when this connection successfully connects to the db.
  May be emitted multiple times in reconnected scenarios.

  open: Emitted after we connected and onOpen is executed on all of this connections models.

  disconnecting: Emitted when connection.close() was executed.

  disconnected: Emitted after getting disconnected from the db.

  close: Emitted after we disconnected and onClose executed on all of this connections models.

  reconnected: Emitted after we connected and subsequently disconnected, followed by successfully
  another successfull connection.

  error: Emitted when an error occurs on this connection.

  fullsetup: Emitted in a replica-set scenario, when all nodes specified in
  the connection string are connected.

*/
module.exports = function (config, logger) {

  var logInfoEvents = [
    'connecting',
    'connected',
    'open',
    'disconnecting',
    'disconnected',
    'close',
    'reconnected',
    'fullsetup'
  ];

  logInfoEvents.forEach(addLogInfo);
  mongoose.connect(config.url);
  return mongoose;

  function addLogInfo(eventType) {

    var msg = 'Mongoose ' + eventType;

    mongoose.connection.on(eventType, function () {
      logger.info({ config: config }, msg);
    });

  }

};
