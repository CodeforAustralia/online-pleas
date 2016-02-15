(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcGuiltyPleas')
    .config(function($urlRouterProvider){
      // route the default state to the app home
      $urlRouterProvider.when('', '/');
    })
    .config(function (CacheFactoryProvider) {
      angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });
    })
    .config(function($datepickerProvider) {
      angular.extend($datepickerProvider.defaults, {
        dateFormat: 'dd MMM yyyy',
        modelDateFormat: 'yyyy-MM-dd',
        dateType: 'string',
        startWeek: 1,
        useNative: true,
        autoclose: true
      });
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
  	.state('home', { // state for showing all movies
  		url: '/',
  		templateUrl: 'js/partials/home.html',
  		controller: 'HomeController',
      controllerAs: 'vm',
      resolve: {

      }
  	})
    .state('form', {
      abstract: true,
      template: '<ui-view/>',
      resolve: {

      }
  	})
    .state('form.details', {
  		url: '/form',
  		templateUrl: 'js/partials/form.html',
  		controller: 'FormController',
      controllerAs: 'vm',
      resolve: {
      }
  	});
  }

})();
