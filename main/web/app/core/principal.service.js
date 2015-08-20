(function () {

  'use strict';

  angular
    .module('afrgree.core')
    .factory('principal', principal);

  function principal($q, jwtHelper, store) {

    var _identity;

    return {
      isIdentityResolved: function () {
        return angular.isDefined(_identity);
      },
      isAuthenticated: function () {

        var tokenExpired = true;

        if (!this.isIdentityResolved()) {
          return false;
        }
        if (_identity && _identity.token) {
          tokenExpired = jwtHelper.isTokenExpired(_identity.token);
        }
        if (tokenExpired) {
          this.authenticate();
        }
        return !tokenExpired;

      },
      authenticate: function (identity) {

        _identity = identity;
        if (identity === undefined) {
          store.remove('identity');
        } else {
          store.set('identity', identity);
        }

      },
      identity: function (force) {

        if (force === true) {
          this.authenticate();
        }
        if (angular.isDefined(_identity)) {

          return _identity;

        }

        this.authenticate(store.get('identity'));
        return _identity;

      }

    };

  }

})();
