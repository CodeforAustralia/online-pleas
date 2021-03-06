module.exports = function(app){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  app.config(function($urlRouterProvider){
      // route the default state to the app home
      $urlRouterProvider.when('', '/');
    })
    .config(function (CacheFactoryProvider) {
      angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });
    })
    .config(function($datepickerProvider) {
      angular.extend($datepickerProvider.defaults, {
        modelDateFormat: 'dd/MM/yyyy',
        dateFormat: 'dd/MM/yyyy',
        dateType: 'string',
        startWeek: 1,
        useNative: true,
        autoclose: true,
        iconLeft: "fa fa-chevron-left",
        iconRight: "fa fa-chevron-right"
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
          template: require('./partials/forms/wrappers/label.html'),
        },
        /*{
          name: 'customLabelWithCounter',
          template: require('./partials/forms/wrappers/label-with-counter.html',
        },*/
        {
          name: 'customHasError',
          template: require('./partials/forms/wrappers/has-error.html'),
        },
        {
          name: 'note',
          template: require('./partials/forms/wrappers/field-note.html')
        },
        {
          name: 'noteModal',
          template: require('./partials/forms/wrappers/field-note-modal.html')
        },
        /*{
          name: 'dobSeperateFields',
          template: require('./partials/forms/wrappers/dob-seperate-fields.html')
        },*/
      ]);

      // custom formly templates
      formlyConfig.setType([{
        extends: 'input',
        name: 'customInput',
        wrapper: ['customLabel', 'customHasError'],
        controller: ['$scope', function($scope) {
          $scope.options.data.getValidationMessage = getValidationMessage;

          function getValidationMessage(key) {
            var message = $scope.options.validation.messages[key];
            if (message) {
              return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
            }
          }
        }]
      },
      {
        extends: 'select',
        name: 'customSelect',
        wrapper: ['customLabel', 'customHasError'],
        controller: ['$scope', function($scope) {
          $scope.options.data.getValidationMessage = getValidationMessage;

          function getValidationMessage(key) {
            var message = $scope.options.validation.messages[key];
            if (message) {
              return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
            }
          }
        }]
      },
      {
        extends: 'radio',
        name: 'customRatingRadio',
        template: require('./partials/forms/wrappers/custom-field-rating-radio.html'),
        wrapper: ['customLabel', 'customHasError'],
        controller: ['$scope', function($scope) {
          $scope.options.data.getValidationMessage = getValidationMessage;

          function getValidationMessage(key) {
            var message = $scope.options.validation.messages[key];
            if (message) {
              return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
            }
          }
        }]
      },
      {
        extends: 'checkbox',
        name: 'customCheckbox',
        template: require('./partials/forms/wrappers/custom-field-checkbox.html'),
        wrapper: ['customLabel', 'customHasError'],
        controller: ['$scope', function($scope) {
          $scope.options.data.getValidationMessage = getValidationMessage;

          function getValidationMessage(key) {
            var message = $scope.options.validation.messages[key];
            if (message) {
              return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
            }
          }
        }]
      },
      {
        extends: 'multiCheckbox',
        name: 'customMultiCheckbox',
        wrapper: ['customLabel','customHasError'],
        controller: ['$scope', function($scope) {
          $scope.options.data.getValidationMessage = getValidationMessage;

          function getValidationMessage(key) {
            var message = $scope.options.validation.messages[key];
            if (message) {
              return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
            }
          }
        }]
      },
      {
        extends: 'radio',
        name: 'customRadio',
        wrapper: ['customLabel', 'customHasError'],
        controller: ['$scope', function($scope) {
          $scope.options.data.getValidationMessage = getValidationMessage;

          function getValidationMessage(key) {
            var message = $scope.options.validation.messages[key];
            if (message) {
              return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
            }
          }
        }]
      },
      {
        extends: 'textarea',
        name: 'customTextarea',
        wrapper: ['customLabel', 'customHasError'],
        controller: ['$scope', function($scope) {
          $scope.options.data.getValidationMessage = getValidationMessage;

          function getValidationMessage(key) {
            var message = $scope.options.validation.messages[key];
            if (message) {
              return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
            }
          }
        }]
      },
      {
        extends: 'textarea',
        name: 'customTextareaWithCounter',
        wrapper: ['customLabel', 'customHasError'],
        controller: ['$scope', function($scope) {
          $scope.options.data.getValidationMessage = getValidationMessage;

          function getValidationMessage(key) {
            var message = $scope.options.validation.messages[key];
            if (message) {
              return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
            }
          }
        }]
      },
      {
        extends: 'input',
        name: 'customSplitDate',
        templateUrl: "js/partials/forms/custom-split-date.html",
        wrapper: ['customLabel', 'customHasError'],
        controller: ['$scope', function($scope, $log) {


          $scope.options.data.getValidationMessage = getValidationMessage;

          function getValidationMessage(key) {
            $log.log("CUSTOMDOB");
            $log.log(key);
            $log.log($scope.options.validation.messages[key]);
            var message = $scope.options.validation.messages[key];
            if (message) {
              return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
            }
          }
        }]
      }]);

      // custom formly validation messages
      formlyValidationMessages.addTemplateOptionValueMessage('maxlength', 'maxlength', '', 'is the maximum length', 'Too long');
      formlyValidationMessages.addTemplateOptionValueMessage('minlength', 'minlength', '', 'is the minimum length', 'Too short');
      formlyValidationMessages.messages.required = 'to.label + " is required"';
      formlyValidationMessages.messages.email = '$viewValue + " should be a valid email address"';
      //formlyValidationMessages.addStringMessage('maxlength', '');

      $log.log(formlyValidationMessages);
      $log.log(formlyValidationMessages.messages);
    });

  function stateConfig($stateProvider){
    $stateProvider
  	.state('home', { // state for showing all movies
  		url: '/',
  		template: require('./partials/home.html'),
  		controller: 'HomeController',
      controllerAs: 'vm',
      resolve: {

      }
  	})
    .state('form', {
      abstract: true,
      //template: '<ui-view/>',
      template: require('./partials/form.html'),
      controller: 'FormController',
      controllerAs: 'vm',
      resolve: {

      }
  	})
    .state('form.your-details', {
  		//url: '/form/details',
  		template: require('./partials/your-details.html'),
  	})
    .state('form.your-offence', {
  		//url: '/form/offence',
  		template: require('./partials/your-offence.html'),
  	})
    .state('form.declaration', {
  		//url: '/form/declaration',
  		template: require('./partials/declaration.html'),
  	})
    .state('form.review', {
  		//url: '/form/review',
  		template: require('./partials/review.html'),
  	})
    .state('form.finish', {
  		url: '/submitted',
  		template: require('./partials/confirmation.html'),
  		controller: 'FormConfirmationController',
      controllerAs: 'vm',
      resolve: {
      }
  	});
  }

};
