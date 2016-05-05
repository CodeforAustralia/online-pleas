module.exports = function(app){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  app.controller('FormConfirmationController', FormConfirmationController);

  /*@ngInject*/
  function FormConfirmationController($scope, $log, $rootScope, $state){

    var vm = this;
    vm.model = {};

    function init(){
      $log.log("Loaded the form confirmation controller");
    }

    init();
  }

};
