(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcGuiltyPleas')
    .controller('FormController', FormController);

  /*@ngInject*/
  function FormController($scope, $log, $rootScope, $state, $alert){

    var vm = this;

    vm.place = null;
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

    vm.finish = function(){
      $log.log("FINISHED");
      $state.go("form.finish");
    };

    vm.model = {};

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
        key: 'address',
        type: 'input',
        templateOptions: {
          label: 'Your address',
          placeholder: 'Enter your address',
          required: true,
          'g-places-autocomplete':'g-places-autocomplete'
        },
        ngModelAttrs: {
          'g-places-autocomplete': {attribute: 'g-places-autocomplete'}
        },
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
        wrapper: 'note',
        templateOptions: {
          label: 'Date of your hearing',
          placeholder: 'Enter the date of your hearing',
          required: true,
          'bs-datepicker': 'bs-datepicker',
          form_field_note:'This date is located on your summons document in the section "Where will the case be heard?"'
          //'data-template-url':'js/partials/field-hearing-date-note.html',
        },
        ngModelAttrs: {
          'bs-datepicker': {attribute: 'bs-datepicker'},
          'form-field-note': {attribute: 'form-field-note'}
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
        wrapper: 'note',
        templateOptions: {
          label: 'MNI/JAID',
          placeholder: 'Enter your MNI/JAID reference number',
          required: false,
          form_field_note: 'This reference number may appear on your summons document'
        },
        ngModelAttrs: {
          form_field_note: {attribute: 'form-field-note'}
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
        wrapper: 'note',
        templateOptions: {
          label: 'Message to the Magistrate',
          placeholder: 'Enter a message to be sent to the magistrate',
          form_field_note: 'This might include explaining why you offended, what you\'ve done to repair the harm, or things you\'d like the magistrate to consider when deciding your sentence.'
        },
        ngModelAttrs: {
          form_field_note: {attribute: 'form-field-note'}
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
