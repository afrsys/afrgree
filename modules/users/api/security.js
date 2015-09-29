'use strict';

var q = require('q');
var jwt = require('jwt-simple');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('./User');
var TOKEN_SALT = 'kaDSs230o0iIUzIZSI6M%$xMzk5O$g4asTM0Mn0.sbr3Cgz1cSiNpKzTSXnseAPsdf1AsAdmA3FAo#';

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
          return callback(new Error('security.invalidToken { userId: ' + decoded.iss + ' }'));
        } else {
          return callback(err, null);
        }

      });
    } else {
      
      return callback(new Error('security.invalidToken token expired { timeout: ' + timeout +
        ', now: ' + Date.now + '}'));
    
    }

  } catch (err) {

    err.message = 'security.invalidToken ' + err.message;
    return callback(err, null);

  }

}

// See [spec](http://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#rfc.section.4.1)
function issueToken(email, password, tokenLifetime, logger) {

  var deferred = q.defer();

  logger.debug({ email: email, password: (password ? true : false), tokenLifetime: tokenLifetime },
    'issueToken');

  User.findOne({ email: email }).then(function (user) {

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

      }, function (err) {
        deferred.reject(err);
      });

    } else {
      deferred.reject(new Error('security.userNotFound { email: ' + email + ' }'));
    }
  }, deferred.reject);

  return deferred.promise;

}
