module.exports = function(app){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  app.controller('ConfirmationFormController', ConfirmationFormController);

  /*@ngInject*/
  function ConfirmationFormController($scope, $log, $rootScope, $state, $alert, $tooltip){

    var vm = this;

    function init(){
      $log.log("Loaded the ConfirmationFormController");
    }

    init();
  }

};
