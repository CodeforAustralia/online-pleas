(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcOnlinePleas')
    .controller('YesNoModalController', YesNoModalController);

  /*@ngInject*/
  function YesNoModalController($scope, $log){

    var vm = this;

    function init(){
      $log.log("Loaded the yes no modal");
    }

    init();
  }

})();
