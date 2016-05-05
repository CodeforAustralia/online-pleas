module.exports = function(app){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  app.controller('YesNoModalController', YesNoModalController);

  /*@ngInject*/
  function YesNoModalController($scope, $log){

    var vm = this;

    function init(){
      $log.log("Loaded the yes no modal");
    }

    init();
  }

};
