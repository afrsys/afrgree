'use strict';

var q = require('q');
var _ = require('lodash');
var queryError = new Error('mongoQueryError');
var writeError = new  Error('mongoWriteError');

exports.queryError = function (model, sandbox) {

  var Query = require('mongoose').Query;
  var query = null;

  sandbox.stub(Query.prototype, 'exec', callbackOrPromise);

  sandbox.stub(Query.prototype, 'then', function (success, error) {
    error(queryError);
  });
  
  _(['find', 'findOne', 'findById']).forEach(function (fnName) {

    sandbox.stub(model, fnName, callbackOrPromise);

  }).value();

  function callbackOrPromise() {
    if ((arguments.length > 0) && (typeof arguments[arguments.length - 1] === 'function')) {
      return arguments[arguments.length - 1](queryError);
    } else {
      if (!query) {
        query = new Query();
      }
      return query;
    };
  }

};

exports.writeError = function (model, sandbox) {

  _(['save']).forEach(function (fnName) {

    sandbox.stub(model.prototype, fnName, function () {
      if ((arguments.length > 0) && (typeof arguments[arguments.length - 1] === 'function')) {
        return arguments[arguments.length - 1](writeError);
      } else {
        return q.reject(writeError);
      }
    });

  }).value();

};
