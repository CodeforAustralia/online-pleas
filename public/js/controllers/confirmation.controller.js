(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcGuiltyPleas')
    .controller('ConfirmationFormController', ConfirmationFormController);

  /*@ngInject*/
  function ConfirmationFormController($scope, $log, $rootScope, $state, $alert, $tooltip){

    var vm = this;

    function init(){
      $log.log("Loaded the ConfirmationFormController");
    }

    init();
  }

})();
