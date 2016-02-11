(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcEfvApp')
    .controller('AdminController', AdminController);

  /*@ngInject*/
  function AdminController($scope, $log, $rootScope, DataSource){

    var vm = this;
    vm.item_list = DataSource.get();

    function init(){
      $log.log("Loaded the admin controller");
    }

    init();
  }

})();
