(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcEfvApp')
    .config(function($urlRouterProvider){
      // route the default state to the app home
      $urlRouterProvider.when('', '/');
    })
    .config(function (CacheFactoryProvider){
      angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });
    })
    .controller('AppController', function ($log, $scope, $rootScope) {
      var main = this;

      $rootScope.user = {
        name: ""
      };

      $log.log("AppController loading");
    })
    .config(stateConfig)
    .constant('_', window._)
    .run(function($log, $rootScope, $location){
      $log.log("Running the app");
    });

  function stateConfig($stateProvider){
    $stateProvider
  	.state('admin', { // state for showing all movies
  		url: '/',
  		templateUrl: 'js/partials/admin.html',
  		controller: 'AdminController',
      controllerAs: 'vm',
      resolve: {

      }
  	})
    .state('sms-order', { // state for sending an sms to the client
  		url: '/sms-order/:id',
  		templateUrl: 'js/partials/sms-order.html',
  		controller: 'SmsOrderController',
      controllerAs: 'vm',
      resolve: {

      }
  	})
    .state('sms-order-form', { // state for sending an sms to the client
  		url: '/sms-order-form/:id',
  		templateUrl: 'js/partials/sms-order-form.html',
  		controller: 'SmsOrderFormController',
      controllerAs: 'vm',
      resolve: {

      }
  	})
    .state('view-order', { // state for viewing the order
  		url: '/view-order/:id',
  		templateUrl: 'js/partials/view-order.html',
  		controller: 'ViewOrderController',
      controllerAs: 'vm',
      resolve: {

      }
  	});
  }

})();
