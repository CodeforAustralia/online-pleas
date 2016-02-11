(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcEfvApp')
    .controller('LoginController', LoginController);

  /*@ngInject*/
  function LoginController($scope, $log, $rootScope, $state){

    var vm = this;
    vm.model = {};

    vm.login = function(){
      $log.log("Logging in");
      $log.log($rootScope);
      $log.log(vm);
      $rootScope.user = {
        name: vm.model.username
      };
      $state.go("viewer");
    };

    function init(){
      $log.log("Loaded the login controller");
    }

    init();
  }

})();
