(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcGuiltyPleas')
    .controller('YourDetailsFormController', YourDetailsFormController);

  /*@ngInject*/
  function YourDetailsFormController($scope, $log, $rootScope, $state, $alert, $tooltip){

    var vm = this;

    function init(){
      $log.log("Loaded the YourDetailsFormController");
    }

    init();
  }

})();
