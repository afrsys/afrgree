(function () {

  'use strict';

  module.exports = {
    databaseUrl: process.env.MONGOLAB_URI || 'mongodb://localhost/afrgree',
    httpPort: process.env.PORT || 3000,
    pageSize: process.env.PAGE_SIZE || 20,
    logLevel: process.env.LOG_LEVEL || 'error',
    security: {
      hashFactor: process.env.SECURITY_HASH_FACTOR || 4,
      tokenLifetime: process.env.SECURITY_TOKEN_LIFETIME || 604800,
    }

  };

})();
