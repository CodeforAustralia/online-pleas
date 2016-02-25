(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcGuiltyPleas')
    .controller('ReviewFormController', ReviewFormController);

  /*@ngInject*/
  function ReviewFormController($scope, $log, $rootScope, $state, $alert, $tooltip){

    var vm = this;

    function init(){
      $log.log("Loaded the ReviewFormController");
    }

    init();
  }

})();
