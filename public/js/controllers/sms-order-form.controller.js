(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcEfvApp')
    .controller('SmsOrderFormController', SmsOrderFormController);

  /*@ngInject*/
  function SmsOrderFormController($scope, $state, $stateParams, $log, $rootScope, DataSource, $http){

    var vm = this;

    $log.log($state);
    $log.log($stateParams);

    vm.order = DataSource.find($stateParams.id);
    vm.number = "+61424634699";
    vm.message = "Hi "+ vm.order.name +", here is a link to your online intervention order for case: #"+ vm.order.id +". http://njc-efv.herokuapp.com/#/doc/1a3e62fd271. \nSent from the Neighbourhood Justice Centre";
    vm.sent = false;

    vm.send = function(){
      $http.post('/sms', {
          "to": vm.number,
          "message": vm.message
      })
      .then(function(response) {
          // Success - do something
          $log.log(response);
          vm.sent = true;
      },function(error) {
          // Success - do something
          $log.log(error);
      });
    };

    function init(){
      $log.log("Loaded the sms order form controller");
    }

    init();
  }

})();
