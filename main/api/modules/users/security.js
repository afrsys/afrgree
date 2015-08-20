(function () {

  'use strict';

  var q = require('q');
  var jwt = require('jwt-simple');
  var passport = require('passport');
  var BearerStrategy = require('passport-http-bearer').Strategy;
  var User = require('./User');
  var TOKEN_SALT = 'kaDSs230o0iIUzIZSI6M%$xMzk5O$g4asTM0Mn0.sbr3Cgz1cSiNpKzTSXnseAPsdf1AsAdmA3FAo#';
  var config = require('../../config');
  var errorCode = require('../../core/errorCode');

  module.exports = {
    passport: passport,
    isAuth: isAuth,
    issueToken: issueToken,
    verifyToken: verifyToken,
    TOKEN_SALT: TOKEN_SALT
  };

  /**
   * Decodes and verifies the token and calls passport callback(err, user).
   */
  passport.use('bearer', new BearerStrategy({ passReqToCallback: true }, verifyToken));

  /**
   * Returns passport authentication function.
   */
  function isAuth() {
    return passport.authenticate('bearer', { session: false });
  }

  function verifyToken(req, token, callback) {

    var logger = req.logger;

    try {

      logger.debug({ token: token });

      var decoded = jwt.decode(token, TOKEN_SALT);
      var timeout = decoded.exp * 1000;

      logger.debug({ decoded: decoded, now: Date.now(), valid: timeout > Date.now() });

      if (timeout > Date.now()) {
        User.findById(decoded.iss, function (err, user) {

          logger.debug({ err: err, user: user });

          if (user) {
            return callback(null, user);
          } else if (!err) {

            logger.debug({ userId: decoded.iss }, 'invalidUserId');

            var invalidTokenErr = new Error('invalidToken');

            invalidTokenErr.statusCode = 401;
            return callback(invalidTokenErr, null);

          } else {

            logger.error(err);
            return callback(err, null);

          }

        });
      } else {

        logger.debug({ timeout: timeout, now: Date.now() }, 'tokenExpired');
        return callback(errorCode(new Error('invalidToken'), 401), null);

      }

    } catch (ex) {

      logger.error(ex);
      return callback(errorCode(new Error('invalidToken'), 401), null);

    }

  }

  // See [spec](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#rfc.section.4.1)
  function issueToken(email, password, logger) {

    var deferred = q.defer();

    logger.debug({ email: email, password: (password ? true : false) }, 'issueToken');

    var tokenLifetime = config.security.tokenLifetime;

    User.findOne({ email: email }, function (err, user) {
      if (user) {
        user.checkPassword(password, logger)
          .then(function () {

            var timeout = Date.now() + tokenLifetime * 1000;
            var exp = Math.floor(timeout / 1000);
            var token = jwt.encode({ iss: user._id, exp: exp }, TOKEN_SALT);
            var data = {
              user: {
                _id: user._id,
                name: user.name,
                email: user.email
              },
              token: token,
              timeout: timeout
            };

            logger.debug({ data: data }, 'issueToken');
            deferred.resolve(data);

          })
          .catch(function (err) {
            if (!err) {

              logger.debug({ email: email, exists: true }, 'invalidUsernamePassword');
              deferred.reject(errorCode(new Error('invalidUsernamePassword'), 401));

            } else {
              deferred.reject(err);
            }
          });
      } else if (!err) {

        logger.debug({ email: email, exists: false }, 'invalidUsernamePassword');
        deferred.reject(errorCode(new Error('invalidUsernamePassword'), 401));

      } else {
        deferred.reject(err);
      }
    });
    return deferred.promise;

  }

})();
