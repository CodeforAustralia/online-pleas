(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcEfvApp')
    .controller('SmsOrderController', SmsOrderController);

  /*@ngInject*/
  function SmsOrderController($scope, $state, $stateParams, $log, $rootScope, DataSource){

    var vm = this;

    $log.log($state);
    $log.log($stateParams);

    vm.order = DataSource.find($stateParams.id);

    function init(){
      $log.log("Loaded the sms order controller");
    }

    init();
  }

})();
