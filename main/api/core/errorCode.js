(function () {

  'use strict';

  /**
   * @param {Error} err
   * @param {integer} [statusCode=500]
   * @returns {Error} with statusCode
   */
  module.exports = function errorCode (err, statusCode) {
    
    err.statusCode = statusCode || 500;
    return err;

  };

})();
