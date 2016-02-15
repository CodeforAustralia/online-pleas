(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcGuiltyPleas')
    .controller('FormController', FormController);

  /*@ngInject*/
  function FormController($scope, $log, $rootScope, $state){

    var vm = this;

    vm.finish = function(){
      $log.log("FINISHED");
      $state.go("form.finish");
    };

    vm.model = {};

    vm.steps = [
      {
        templateUrl: 'js/partials/your-details.html',
        title: 'Your details'
      },
      {
        templateUrl: 'js/partials/your-offence.html',
        title: 'Your offence'
      },
      {
        templateUrl: 'js/partials/declaration.html',
        title: 'Declaration'
      },
      {
        templateUrl: 'js/partials/review.html',
        title: 'Review your plea'
      }
    ];

    vm.fields = {};
    vm.fields.your_details = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Your name',
          placeholder: 'Enter your name',
          required: true
        }
      },
      {
        key: 'contact_method',
        type: 'select',
        templateOptions: {
          label: 'Preferred contact',
          placeholder: 'Select a preferred contact method',
          required: true,

          options: [
            {name: "Phone", value: "phone"}, {name: "Email", value: "email"}
          ],
        }
      },
      {
        key: 'contact',
        type: 'input',
        templateOptions: {
          label: 'Contact',
          placeholder: 'Enter your contact',
          required: true
        }
      },
    ];

    vm.fields.your_offence = [
      {
        key: 'hearing_date',
        type: 'input',
        templateOptions: {
          label: 'Date of your hearing',
          placeholder: 'Enter the date of your hearing',
          required: true,
          'bs-datepicker': 'bs-datepicker'
        },
        ngModelAttrs: {
          'bs-datepicker': {
            attribute: 'bs-datepicker'
          }
        },
      },
      {
        key: 'offence_date',
        type: 'input',
        templateOptions: {
          label: 'Date of your offence',
          placeholder: 'Enter the date your offence was committed',
          required: true,
          'bs-datepicker': 'bs-datepicker'
        },
        ngModelAttrs: {
          'bs-datepicker': {
            attribute: 'bs-datepicker'
          }
        },
      },
      {
        key: 'offence_number',
        type: 'input',
        templateOptions: {
          label: 'Your offence number',
          placeholder: 'Enter the offence number you received',
          required: true
        }
      },
      {
        key: 'offence_details',
        type: 'textarea',
        templateOptions: {
          label: 'Details of your offence(s)',
          placeholder: 'Enter the details of your offence(s)',
          required: true
        }
      },
      {
        key: 'message',
        type: 'textarea',
        templateOptions: {
          label: 'Message to the Magistrate',
          placeholder: 'Enter a message to be sent to the magistrate',
        }
      },
    ];

    vm.fields.declaration = [
      {
        key: 'acknowledgement',
        type: 'checkbox',
        templateOptions: {
          label: 'I acknowledge I may plead guilty or not guilty. I acknowledge no police officer or other person told me to plead guilty',
          required: true
        }
      },
      {
        key: 'plead_guilty',
        type: 'checkbox',
        templateOptions: {
          label: 'I plead guilty to the offence(s) listed in this form. This plea is entered voluntarily of my own free will',
          required: true
        }
      }
    ];

    function init(){
      $log.log("Loaded the form controller");
    }

    init();
  }

})();
