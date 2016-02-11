(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcEfvApp')
    .controller('ViewOrderController', ViewOrderController);

  /*@ngInject*/
  function ViewOrderController($scope, $state, $stateParams, $log, $rootScope, DataSource){

    var vm = this;

    $log.log($state);
    $log.log($stateParams);

    vm.order = DataSource.find($stateParams.id);

    function init(){
      $log.log("Loaded the view order controller");
    }

    init();
  }

})();
