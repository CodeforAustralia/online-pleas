(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcOnlinePleas')
    .controller('FormController', FormController);

  /*@ngInject*/
  function FormController($scope, $log, $rootScope, $state, $alert, $modal, $http, $interval){

    var vm = this;

    vm.steps = [
      {'id':0, 'label': 'Your details'},
      {'id':1, 'label': 'Your offence'},
      {'id':2, 'label': 'Declarations'},
      {'id':3, 'label': 'Review'}
    ];

    // default to your details
    vm.current_step_id = 0;

    vm.place = null;
    vm.errors = [];

    vm.cleanupDate = formatDateForCourtlink;

    vm.cancelForm = function(){
      var exitModal = $modal({scope: $scope, show: true, content: "Are you sure you would like to exit the form?", templateUrl: "js/partials/yes-no-modal.html"});

      $scope.exitForm = function(confirm){
        $log.log("Confirming");
        if (confirm){
          exitModal.hide();
          resetForm();
          $state.go("home");
        }
        else {
          exitModal.hide();
        }
      };

    };

    vm.submit = function(){
      var fields = angular.copy(vm.model);
      fields.address = cleanupGoogleAddress(fields.address);
      fields.plead_guilty = (fields.plead_guilty) ? "YES" : "NO";
      fields.acknowledgement = (fields.acknowledgement) ? "YES" : "NO";
      fields.birthday = formatDateForCourtlink(vm.model.birthday);

      $http.post("pleas", fields)
        .then(function(){
          $state.go('form.finish');
        }, function(){
          $log.log("Show an error");
          error();
        });
    };

    function formatDateForCourtlink(date){
      // takes an object with {year, month, day} => returns a formatted date
      // return the shortform
      var d = new Date(date.year, date.month, date.day);
      var monthnames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
      return d.getDate() + " " + monthnames[d.getMonth()].slice(0, 3) + " " + d.getFullYear();
    }

    function formatDateYMD(date){
      // convert the date to YMD
      var d = new Date(date.year, date.month, date.day);
      return d.getFullYear() + "-" + (d.getMonth()+1) + d.getDate();
    }

    function cleanupGoogleAddress(address){
      // extract the parts we need from the google address
      return address.formatted_address;
    }

    vm.prev = function(prev_step){
      vm.errors = [];
      vm.current_step_id--;
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
        vm.current_step_id++;
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

    vm.showMinorOffences = function(){
      $log.log("SHOW MINOR OFFENCES");
    };

    vm.fields = {};
    vm.fields.your_details = [
      {
        key: 'given_name',
        type: 'customInput',
        templateOptions: {
          label: 'Given Name(s)',
          //placeholder: 'Enter your given name(s)',
          required: true,
        },
      },
      {
        key: 'family_name',
        type: 'customInput',
        templateOptions: {
          label: 'Family Name',
          //placeholder: 'Enter your family name',
          required: true
        }
      },
      {
        key: 'address',
        type: 'customInput',
        templateOptions: {
          label: 'Residential address',
          //placeholder: 'Enter your address',
          required: true,
          'g-places-autocomplete':'g-places-autocomplete'
        },
        ngModelAttrs: {
          'g-places-autocomplete': {attribute: 'g-places-autocomplete'}
        },
      },
      {
        key: 'birthday',
        //type: 'customInput',
        type: 'customDob',
        templateOptions: {
          label: 'Date of Birth',
          placeholder: 'Enter your date of birth',
          required: true,
          //'bs-datepicker': 'bs-datepicker'
        },
        ngModelAttrs: {
          'bs-datepicker': {
            attribute: 'bs-datepicker'
          }
        },
        validators: {
          pastDate: {
            expression: function($viewValue, $modelValue, scope){
              var value = $modelValue || $viewValue;
              // just check if the year is less than the current year
              if (!_.isUndefined(value) && !_.isUndefined(value.year) && value.year.length == 4){
                var cyear = Date.getFullYear();
                if (value.year < cyear){
                  return true;
                }
                return false;
              }
              /*if (!_.isUndefined(value)){
                $log.log(value);
                value = formatDateYMD(value);
                var today = formatDateYMD({day: Date.getDate(), month: Date.getMonth(), year: Date.getFullYear() });
                $log.log(today);
                if (value < today){
                  return true;
                }
                return false;
              }*/
              return true;
            },
            message: '$viewValue must be a previous date'
          }
        }
      },
      {
        key: 'contact_method',
        type: 'customSelect',
        //wrapper: ['customLabel', 'customHasError'],
        templateOptions: {
          label: 'Preferred contact',
          //placeholder: 'select a preferred contact method',
          required: true,
          options: [
            {name: "Phone", value: "phone"}, {name: "Email", value: "email"}
          ],
        }
      },
      {
        key: 'contact',
        type: 'customInput',
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
        type: 'customInput',
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
        type: 'customInput',
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
        key: 'offence_details',
        type: 'customTextarea',
        wrapper: 'noteModal',
        templateOptions: {
          label: 'Details of your offence(s)',
          placeholder: 'Enter the details of your offence(s) as described on your summons notice',
          required: true,
          modal_url: 'js/partials/minor-offences.html',
          form_field_note: 'Offences for which you can submit a plea online'
        }
      },
      {
        key: 'message',
        type: 'customTextareaWithCounter',
        wrapper: 'note',
        templateOptions: {
          label: 'Message to the Magistrate',
          placeholder: 'Enter a message to be sent to the magistrate',
          maxlength: 600,
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
        type: 'customCheckbox',
        templateOptions: {
          label: 'I acknowledge I may plead guilty or not guilty. I acknowledge no police officer or other person told me to plead guilty',
          required: true
        }
      },
      {
        key: 'plead_guilty',
        type: 'customCheckbox',
        templateOptions: {
          label: 'I plead guilty to the offence(s) listed in this form. This plea is entered voluntarily of my own free will',
          required: true
        }
      }
    ];


    function resetForm(){
      vm.errors = {};
      vm.model = {};
    }

    function error(){
      $log.log("ERROR");
      $alert({
        title: 'Holy guacamole!',
        content: 'Best check yo self, you\'re not looking too good.',
        type: 'danger',
        show: false,
        container: "#alert-container",
        duration: 2500,
        dismissable: true
      });
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
    }

    init();
  }

})();
