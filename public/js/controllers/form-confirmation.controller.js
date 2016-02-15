(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcGuiltyPleas')
    .controller('FormConfirmationController', FormConfirmationController);

  /*@ngInject*/
  function FormConfirmationController($scope, $log, $rootScope, $state){

    var vm = this;
    vm.model = {};

    function init(){
      $log.log("Loaded the form confirmation controller");
    }

    init();
  }

})();
