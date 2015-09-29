'use strict';

var errorcode = require('errorcode');
var router = require('express').Router();
var security = require('./security');
var errorcode = require('errorcode');

errorcode.register({
  'security.invalidToken': 401,
  'security.userNotFound': 401,
  'user.wrongPassword': 401,
  'user.cantChangePassword': 403
});

module.exports = router;

router.post('/auth/password', function (req, res, next) {

  if (req.body.email && req.body.password) {

    req.redis.get('security.tokenLifetime', function (err, tokenLifetime) {

      if (err) { next(err); }

      security.issueToken(req.body.email, req.body.password, parseInt(tokenLifetime), req.logger)
      .then(function success (data) {
        res.status(200).jsonp(data);
      }, next);
    
    });

  } else {
    next(new ReferenceError('core.missing { email: ' + !req.body.email +
      ', password: ' + !req.body.password + '}'));
  }

});

router.put('/auth/password/', security.isAuth(), function (req, res, next) {

  if (req.body.oldPassword && req.body.newPassword) {
    
    req.user.checkPassword(req.body.oldPassword, req.logger)
    .then(function () {

      req.redis.get('security.hashFactor', function (err, hashFactor) {

        req.user.setPassword(req.body.newPassword, parseInt(hashFactor), req.logger)
        .then(function () {

          req.user.save(function (err) {

            if (!err) {
              return res.status(200).send();
            } else {
              return next(err);
            }
          
          });

        }, next);

      });

    }, function (err) {

      if (err.message === 'user.wrongPassword') {
        err.message = 'user.cantChangePassword user.wrongPassword';
      }
      next(err);
    
    });
  } else {
    return next(new ReferenceError('core.missing { oldPassword: ' + !req.body.oldPassword +
      ', newPassword: ' + !req.body.newPassword + ' }'));
  }
});

