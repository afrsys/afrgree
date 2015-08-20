(function () {

  'use strict';

  angular
    .module('afrgree.core')
    .provider('loading', LoadingProvider);

  function LoadingProvider() {

    var options = {};

    this.$get = get;
    this.config = config;

    function get($window, $timeout) {

      var np = $window.NProgress, level = 0, timer;

      np.configure(options);
      return {
        start: function () {

          if (timer) {

            $timeout.cancel(timer);
            timer = null;

          }
          if (level === 0) {
            np.start();
          } else {
            np.inc();
          }
          level += 1;

        },
        done: function () {

          if (level > 0) {
            level -= 1;
          }
          if (level === 0) {
            timer = $timeout(np.done.bind(np), 100);
          } else {
            np.inc();
          }

        },
        status: function () {
          return np.status;
        }
      };

    }

    function config(o) {
      options = o;
    }

  }

})();
