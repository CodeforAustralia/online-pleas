(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcGuiltyPleas')
    .controller('FormController', FormController);

  /*@ngInject*/
  function FormController($scope, $log, $rootScope, $state, $alert, $tooltip){

    var vm = this;

    vm.errors = [];

    vm.prev = function(prev_step){
      vm.errors = [];
      $state.go('form.'+prev_step.replace("_", "-"));
    };

    vm.next = function(current_step, next_step){
      vm.checkRequiredFields(current_step);
      $log.log("Moving to: " + next_step);
      // check the required fields
      $log.log(vm.fields);
      vm.checkRequiredFields(current_step);
      if (vm.errors.length === 0){
        $state.go('form.'+next_step.replace("_", "-"));
      }
    };

    vm.checkRequiredFields = function(step){
      $log.log("Checking: " + step);
      vm.errors = [];
      var fields = vm.fields[step];

      $log.log(fields);

      if (step !== 'declaration'){
        fields.forEach(function(field){
          if (field.formControl.$invalid)
            vm.errors.push({'message': field.templateOptions.label + " is required"});
        });
      }
      else {
        var valid = true;
        fields.forEach(function(field){
          if (field.formControl.$invalid)
            valid = false;
        });
        // custom error message
        if (!valid)
          vm.errors.push({'message': "You must agree to both declarations to proceed"});
      }
    };

    /*vm.next = function(){
      $log.log("Next func");
      vm.steps.$nextStep();
    };

    vm.checkFields = function(){
      // $nextStep();
      $log.log("STEP CHANGE");
      //$log.log("VALID:");
      //$log.log($getActiveStep().valid);
      return false;
    };*/

    //var new_alert;
    vm.new_tooltip = function(elem,title){
      $log.log("NEW TOOLTIP");
      //elem = angular.element(elem.id);
      $log.log(elem);
      var tar = angular.element(document.querySelector("#" + elem.id));
      $log.log(tar);

      $tooltip(tar, {
        title: title,
        placement: 'right',
        trigger: 'hover'
      });
    };

    vm.finish = function(){
      $log.log("FINISHED");
      $state.go("form.finish");
    };

    vm.model = {};

    /*// TRY: https://scotch.io/tutorials/angularjs-multi-step-form-using-ui-router

    vm.steps = [
      {
        templateUrl: 'js/partials/your-details.html',
        title: 'Your details',
        hasForm: true,
        controller: 'YourDetailsFormController',
      },
      {
        templateUrl: 'js/partials/your-offence.html',
        title: 'Your offence',
        hasForm: true,
      },
      {
        templateUrl: 'js/partials/declaration.html',
        title: 'Declaration',
        hasForm: true,
      },
      {
        templateUrl: 'js/partials/review.html',
        title: 'Review your plea',
        hasForm: true,
      }
    ];*/

    vm.fields = {};
    vm.fields.your_details = [
      {
        key: 'first-name',
        type: 'input',
        templateOptions: {
          label: 'Your first name',
          placeholder: 'Enter your first name',
          required: true,
        },
        ngModelAttrs: {
          'bs-tooltip': {attribute: 'bs-tooltip'},
          'data-trigger': {attribute: 'data-trigger'},
          'data-placement': {attribute: 'data-placement'},
          'data-container': {attribute: 'data-container'},
          'data-type': {attribute: 'data-type'},
          'data-title': {attribute: 'data-title'},
          'data-animation': {attribute: 'data-animation'}
        }
      },
      {
        key: 'last-name',
        type: 'input',
        templateOptions: {
          label: 'Your last name',
          placeholder: 'Enter your last name',
          required: true
        }
      },
      {
        key: 'birthday',
        type: 'input',
        templateOptions: {
          label: 'Date of Birth',
          placeholder: 'Enter your date of birth',
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
          label: 'Contact', // make this label dynamic
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
          },
          'form-note': {
            attribute: 'This date is located on your summons document in the section "Where will the case be heard?"'
          }
        }
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
        key: 'offence_number', // Maybe make the form 'extra informatioon a directive or something, slots in after the correct field etc'
        type: 'input',
        templateOptions: {
          label: 'MNI/JAID',
          placeholder: 'Enter your MNI/JAID reference number',
          required: false
        },
        ngModelAttrs: {
          'form-note': {
            attribute: "This reference number may appear on your summons document"
          }
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
        },
        ngModelAttrs: {
          'form-note': {
            attribute: "This might include explaining why you offended, what you've done to repair the harm, or things you'd like the magistrate to consider when deciding your sentence."
          }
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

    function error(){
      new_alert = $alert({
        title: 'Holy guacamole!',
        content: 'Best check yo self, you\'re not looking too good.',
        type: 'danger',
        show: false,
        container: "#alert-container",
        duration: 2500,
        dismissable: true
      });

      new_alert.show();
    }

    function success(callback){
      $log.log("Success");
      $alert({
        title: 'Holy guacamole!',
        content: 'Best check yo self, you\'re not looking too good.',
        type: 'success',
        show: true,
        placement: '',
        container: "#alert-container",
        duration: 5,
        dismissable: true
      });
    }

    function init(){
      $log.log("Loaded the form controller");
      success();
    }

    init();
  }

})();
