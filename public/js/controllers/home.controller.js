module.exports = function(app){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  app.controller('HomeController', HomeController);

  /*@ngInject*/
  function HomeController($scope, $log, $rootScope, $state){

    var vm = this;
    vm.model = {};

    vm.login = function(){
      $log.log("Logging in");
      $log.log($rootScope);
      $log.log(vm);
      $state.go("viewer");
    };

    function init(){
      $log.log("Loaded the home controller");
    }

    init();
  }

};
