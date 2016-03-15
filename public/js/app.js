(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcOnlinePleas')
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
    .run(function($log, $rootScope, $location, formlyValidationMessages, formlyConfig){
      $log.log("Running the app");

      // custom form field wrappers
      formlyConfig.setWrapper([
        {
          name: 'customLabel',
          templateUrl: 'js/partials/forms/wrappers/label.html',
        },
        /*{
          name: 'customLabelWithCounter',
          templateUrl: 'js/partials/forms/wrappers/label-with-counter.html',
        },*/
        {
          name: 'customHasError',
          templateUrl: 'js/partials/forms/wrappers/has-error.html',
        },
        {
          name: 'note',
          templateUrl: 'js/partials/forms/wrappers/field-note.html'
        },
        {
          name: 'noteModal',
          templateUrl: 'js/partials/forms/wrappers/field-note-modal.html'
        }
      ]);

      // custom formly templates
      formlyConfig.setType([{
        extends: 'input',
        name: 'customInput',
        wrapper: ['customLabel', 'customHasError']
      },
      {
        extends: 'select',
        name: 'customSelect',
        wrapper: ['customLabel', 'customHasError']
      },
      {
        extends: 'checkbox',
        name: 'customCheckbox',
        wrapper: ['customHasError'],
      },
      {
        extends: 'multiCheckbox',
        name: 'customMultiCheckbox',
        wrapper: ['customLabel','customHasError'],
      },
      {
        extends: 'radio',
        name: 'customRadio',
        wrapper: ['customLabel', 'customHasError']
      },
      {
        extends: 'textarea',
        name: 'customTextarea',
        wrapper: ['customLabel', 'customHasError']
      },
      {
        extends: 'textarea',
        name: 'customTextareaWithCounter',
        wrapper: ['customLabel', 'customHasError']
      }]);

      // custom formly validation messages
      formlyValidationMessages.addStringMessage('required', 'This field is required');
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
      //template: '<ui-view/>',
      templateUrl: 'js/partials/form.html',
      controller: 'FormController',
      controllerAs: 'vm',
      resolve: {

      }
  	})
    .state('form.your-details', {
  		//url: '/form/details',
  		templateUrl: 'js/partials/your-details.html',
  	})
    .state('form.your-offence', {
  		//url: '/form/offence',
  		templateUrl: 'js/partials/your-offence.html',
  	})
    .state('form.declaration', {
  		//url: '/form/declaration',
  		templateUrl: 'js/partials/declaration.html',
  	})
    .state('form.review', {
  		//url: '/form/review',
  		templateUrl: 'js/partials/review.html',
  	})
    .state('form.finish', {
  		url: '/submitted',
  		templateUrl: 'js/partials/confirmation.html',
  		controller: 'FormConfirmationController',
      controllerAs: 'vm',
      resolve: {
      }
  	});
  }

})();
