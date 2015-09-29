(function () {

  'use strict';

  angular
  .module('afrgree')
  .factory('confirmDialogService', function ($modal) {

    var srvc = {
      showModal: showModal
    };

    function showModal (title, message) {

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/app/core/confirm-dialog.html',
        controller: 'ConfirmDialogController',
        controllerAs: 'dialogCtrl',
        resolve: {
          data: function () {
            return {
              title: title,
              message: message
            };
          }
        }
      });

      return modalInstance.result;
      
    }

    return srvc;

  });
      
})();
