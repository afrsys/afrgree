'use strict';

var q = require('q');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var HASH_SALT = 'vfaeAiOJkDgTM0N5Qm0#99pCZ1.Np3oSDFfnSsglFk33joKnQmWuAlasdjsdgjtlsdhfWJ(&R2cnNN:';

var Schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  credentials: {
    password: {
      hash: { type: String, required: true }
    }
  }
});

Schema.methods.setPassword = function (password, factor, logger) {

  var deferred = q.defer();
  var user = this;

  bcrypt.hash(password + HASH_SALT, factor, function (err, hash) {
    if (!err) {

      logger.debug({ hash: hash }, 'setPassword');
      user.credentials.password.hash = hash;
      deferred.resolve();
      
    } else {
      deferred.reject(err);
    }
  });
  return deferred.promise;

};

Schema.methods.checkPassword = function (password, logger) {

  var start = Date.now();
  var deferred = q.defer();

  bcrypt.compare(password + HASH_SALT, this.credentials.password.hash, function (err, same) {

    var elapsed = Date.now() - start;

    if (elapsed < 200 || elapsed > 500) {
      logger.warn({ elapsed: elapsed }, 'Adjust hash factor parameter properly');
    }
    logger.debug({ same: same }, 'checkPassword');
    if (!err && same) {
      deferred.resolve();
    } else if (!err && !same) {
      deferred.reject(new Error('user.wrongPassword'));
    } else {
      deferred.reject(err);
    }

  });
  return deferred.promise;

};

module.exports = mongoose.model('users', Schema);

