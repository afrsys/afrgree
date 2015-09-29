'use strict';

var q = require('q');
var _ = require('lodash');

exports.queryError = function (model, errorMessage, sandbox) {

  var query = require('mongoose').Query.prototype;

  sandbox.stub(query, 'exec').yields(new Error(errorMessage));

  sandbox.stub(query, 'then', function (success, error) {
    error(new Error(errorMessage));
  });
  
  _(['find', 'findOne', 'findById']).forEach(function (fnName) {

    sandbox.stub(model, fnName, function () {
      if ((arguments.length > 0) && (typeof arguments[arguments.length - 1] === 'function')) {
        return arguments[arguments.length - 1](new Error(errorMessage));
      } else {
        return query;
      };

    });

  }).value();

};
