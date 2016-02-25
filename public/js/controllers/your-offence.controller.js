(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcGuiltyPleas')
    .controller('YourOffenceFormController', YourOffenceFormController);

  /*@ngInject*/
  function YourOffenceFormController($scope, $log, $rootScope, $state, $alert, $tooltip){

    var vm = this;

    function init(){
      $log.log("Loaded the YourOffenceFormController");
    }

    init();
  }

})();
