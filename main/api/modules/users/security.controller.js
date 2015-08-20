(function () {

  'use strict';
  var security = require('./security');
  var errorCode = require('../../core/errorCode');
  var config = require('../../config');

  module.exports = {
    authPassword: authPassword,
    changePassword: changePassword
  };

  function authPassword(req, res, next) {
    if (req.body.email && req.body.password) {

      security.issueToken(req.body.email, req.body.password, req.logger)
        .then(function (data) {
          res.status(200).jsonp(data);
        })
        .catch(next);

    } else {
      next(errorCode(new ReferenceError(), 400));
    }
  }

  function changePassword(req, res, next) {
    
    if (req.user && req.logger && req.body.oldPassword && req.body.newPassword) {
      req.user.checkPassword(req.body.oldPassword, req.logger).then(function () {
        req.user.setPassword(req.body.newPassword, config.security.hashFactor, req.logger)
        .then(function () {
        
          req.user.save(function (err) {
          if (!err) {
            return res.status(200).send();
          } else {
            return next(err);
          }
        
        });
        }, function (err) {
          return next(err);
        });
      }, function (err) {

        if (err.message === 'invalidUsernamePassword') {
          errorCode(err, 403);
        }
        return next(err);
        
      });
    } else {
      return next(errorCode(new ReferenceError(), 400));
    }
  }

})();
