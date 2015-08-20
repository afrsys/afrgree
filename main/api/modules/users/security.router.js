(function () {

  'use strict';

  var securityController = require('./security.controller');
  var router = require('express').Router();

  module.exports = router;
  router.post('/auth/password', securityController.authPassword);

})();
