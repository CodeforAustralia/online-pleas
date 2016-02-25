(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcGuiltyPleas')
    .controller('DeclarationFormController', DeclarationFormController);

  /*@ngInject*/
  function DeclarationFormController($scope, $log, $rootScope, $state, $alert, $tooltip){

    var vm = this;

    function init(){
      $log.log("Loaded the DeclarationFormController");
    }

    init();
  }

})();
