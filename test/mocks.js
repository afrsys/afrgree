(function () {

  'use strict';
  
  var bunyan = require('bunyan');

  module.exports = {
    logger: logger,
    req: req,
    res: res,
    testLogger: null,
    voidLogger: null
  };

  module.exports.testLogger = bunyan.createLogger({ name: 'testLogger' });
  module.exports.voidLogger = bunyan.createLogger({ name: 'voidLogger' });
  module.exports.testLogger.level(0);
  module.exports.voidLogger.level(100);

  /**
   * @return a fake logger.
   */
  function logger(sandbox) {

    var self = {};

    self.info = sandbox.spy();
    self.error = sandbox.spy();
    self.debug = sandbox.spy();
    self.warn = sandbox.spy();
    self.child = sandbox.stub().returns(self);
    return self;

  }
  
  function req(sandbox) {

    var self = {};

    self.id = 'id';
    self.url = '/';
    self.originalUrl = '/';
    self.method = 'GET' ;
    self.headers = {};
    self.params = {};
    self.query = {};
    self.body = {};
    self.logger = logger(sandbox);
    self.on = sandbox.spy();
    return self;

  }
  
  function res(sandbox) {

    var self = {};

    self.statusCode = 200;
    self.jsonp = sandbox.stub().returns(self);
    self.send = sandbox.stub().returns(self);
    self.end = sandbox.stub().returns(self);
    self.status = sandbox.stub().returns(self);
    self.contentType = sandbox.stub().returns(self);
    return self;

  }

})();
