(function () {

  'use strict';

  var router = require('express').Router();
  var security = require('./users/security');

  module.exports = router;

  router.use(security.passport.initialize());
  router.use('/security/', require('./users/security.router'));
  router.use('/surveys/', require('./surveys/survey.controller').router);
  //From here, all routes needs the token.
  router.use(security.isAuth());

})();
