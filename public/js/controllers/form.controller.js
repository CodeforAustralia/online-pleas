(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcOnlinePleas')
    .controller('FormController', FormController);

  /*@ngInject*/
  function FormController($scope, $log, $rootScope, $state, $alert, $modal, $http, $interval, $sce){

    var vm = this;

    //$log.log($formlyValidationMessages);

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
      //fields.birthday = formatDateForCourtlink(vm.model.birthday);
      fields.birthday = vm.model.birthday;

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

    function formatDateUnix(date){
      // convert the date to UNIX
      // expect 0 based month
      date.year = (date.year.length === 2) ? Number("20"+date.year) : date.year;
      var d = new Date(date.year, date.month, date.day);
      return d.getTime()/1000;
    }

    function formatDateDDMMYYYY(date, delim){
      var delimiter = (delim) ? delim : "/";
      // convert the date to YMD
      // expect 0 based month
      var d = new Date(date.year, date.month, date.day);
      var mon = d.getMonth()+1;
      mon = String(mon).length === 2 ? mon : "0"+String(mon);
      var day = d.getDate();
      day = String(day).length === 2 ? day : "0"+String(day);
      return day + delimiter + mon + delimiter + d.getFullYear();
    }

    function cleanupGoogleAddress(address){
      // extract the parts we need from the google address
      return address.formatted_address;
    }

    function cleanupSplitDate(key, model){
      $log.log("Clean up field " + key + " with data ");
      $log.log(model);
      if (
        !_.isUndefined(model) &&
        !_.isUndefined(model.day) &&
        !_.isUndefined(model.month) &&
        !_.isUndefined(model.year)
      ){
        var ymd = { 'day': model.day || '', 'month': model.month || '', 'year': model.year || '' };
        return formatDateYMD(ymd);
      }
      return false;
    }

    /*vm.checkBusinessRules = {};
    vm.checkBusinessRules.your_details = function(){
      // make sure the dob is a past date
      var today = new Date();
      if (vm.model.your_details.birthday >= today)
        vm.errors.push()
    };*/

    vm.options = {data:{}};
    vm.options.data.getValidationMessage = getValidationMessage;

    function getValidationMessage(key) {
      var message = $scope.options.validation.messages[key];
      if (message) {
        return message($scope.fc.$viewValue, $scope.fc.$modelValue, $scope);
      }
    }

    vm.prev = function(prev_step){
      vm.errors = [];
      vm.current_step_id--;
      $state.go('form.'+prev_step.replace("_", "-"));
    };

    vm.next = function(current_step, next_step){
      vm.checkRequiredFields(current_step);
      //vm.checkBusinessRules(current_step);
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

      if (step === 'your_details'){
        $log.log("CHECK BD");
        var d = cleanupSplitDate('birthday', vm.model.birthday);
        if (d){

        }
        else {
          //fields.birthday.$errors;
          $log.log("ERROR FOUND");
          $log.log(vm.form);
          $log.log(vm.model);
          $log.log(vm.fields);
          var bd = _.find(vm.fields.your_details, {'key':'birthday'});
          $log.log(bd);
          //bd.$error.past = true;
        }
      }

      $log.log("CHECK ALL FIELDS");
      if (step !== 'declaration'){
        fields.forEach(function(field){
          if (field.formControl.$invalid){
            vm.errors.push({'message': field.templateOptions.label + " is required"});
          }
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

    vm.model = {
      your_details: {},
      your_offence: {},
      declarations: {},
    };

    vm.model = {
      contact_method: "email" // default contact method should be email
    };

    vm.showMinorOffences = function(){
      $log.log("SHOW MINOR OFFENCES");
    };

    vm.fields = {};
    vm.fields.your_details = [
      {
        name: 'given_name',
        key: 'given_name',
        type: 'customInput',
        templateOptions: {
          label: 'Given Name(s)',
          //placeholder: 'Enter your given name(s)',
          required: true
        }
      },
      {
        name: 'family_name',
        key: 'family_name',
        type: 'customInput',
        templateOptions: {
          label: 'Family Name',
          //placeholder: 'Enter your family name',
          required: true
        }
      },
      {
        name: 'address',
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
        name: 'birthday',
        key: 'birthday',
        //type: 'customInput',
        type: 'customInput',
        templateOptions: {
          label: 'Date of Birth',
          placeholder: 'dd/mm/yyyy',
          required: true,
          past: true
        },
        validators: {        
          past: {
            expression: function($viewValue, $modelValue, scope){
              var value = $modelValue || $viewValue;
              if (!_.isUndefined(value) && value.length > 0){
                var ymd = value.split("/");
                if (ymd.length == 3){
                  var d = new Date();
                  $log.log(ymd);
                  ymd = formatDateUnix({ day: ymd[0], month: ymd[1]-1, year: ymd[2] });
                  var today = formatDateUnix({ day: d.getDate() , month: d.getMonth(), year: d.getFullYear() });
                  $log.log(ymd);
                  $log.log(today);
                  if (today > ymd)
                    return true;
                }
              }
              return false;
            },
            message: '"Date of birth must be a past date"'
          }
        }
      },
      {
        name: 'contact_method',
        key: 'contact_method',
        type: 'customSelect',
        //wrapper: ['customLabel', 'customHasError'],
        templateOptions: {
          label: 'Preferred contact',
          //placeholder: 'select a preferred contact method',
          required: true,
          options: [
            {name: "Phone number", value: "phone"}, {name: "Email", value: "email"}
          ],
        }
      },
      {
        name: 'contact',
        key: 'contact',
        type: 'customInput',
        templateOptions: {
          label: 'Contact', // make this label dynamic
          placeholder: 'Enter your contact',
          required: true
        },
        expressionProperties: {
          'templateOptions.label': '"Contact " + model.contact_method'
        }
      },
    ];

    vm.fields.your_offence = [
      {
        name: 'hearing_date',
        key: 'hearing_date',
        type: 'customInput',
        wrapper: 'note',
        templateOptions: {
          label: 'Date of your hearing',
          placeholder: 'Enter the date of your hearing',
          required: true,
          'bs-datepicker': 'bs-datepicker',
          form_field_note:'This date is located on your summons document in the section "Where will the case be heard?"',
          future: true,
          //'data-template-url':'js/partials/field-hearing-date-note.html',
        },
        ngModelAttrs: {
          'bs-datepicker': {attribute: 'bs-datepicker'},
          'form-field-note': {attribute: 'form-field-note'}
        },
        validators: {
          future: {
            expression: function($viewValue, $modelValue, scope){
              var value = $modelValue || $viewValue;
              if (!_.isUndefined(value) && value.length > 0){
                var ymd = value.split("/");
                if (ymd.length == 3){
                  var d = new Date();
                  $log.log(ymd);
                  ymd = formatDateUnix({ day: ymd[0], month: ymd[1]-1, year: ymd[2] });
                  var today = formatDateUnix({ day: d.getDate() , month: d.getMonth(), year: d.getFullYear() });
                  $log.log(ymd);
                  $log.log(today);
                  if (today < ymd)
                    return true;
                }
              }
              return false;
            },
            message: '"Date of your hearing must be a future date"'
          }
        }
      },
      {
        name: 'offence_date',
        key: 'offence_date',
        type: 'customInput',
        templateOptions: {
          label: 'Date of your offence',
          placeholder: 'Enter the date your offence was committed',
          required: true,
          'bs-datepicker': 'bs-datepicker',
          past: true
        },
        ngModelAttrs: {
          'bs-datepicker': {
            attribute: 'bs-datepicker'
          }
        },
        validators: {
          past: {
            expression: function($viewValue, $modelValue, scope){
              var value = $modelValue || $viewValue;
              $log.log("Offence date");
              $log.log($modelValue);
              $log.log($viewValue);
              $log.log(scope);
              if (!_.isUndefined(value) && value.length > 0){
                var ymd = value.split("/");
                if (ymd.length == 3){
                  var d = new Date();
                  $log.log(ymd);
                  ymd = formatDateUnix({ day: ymd[0], month: ymd[1]-1, year: ymd[2] });
                  var today = formatDateUnix({ day: d.getDate() , month: d.getMonth(), year: d.getFullYear() });
                  $log.log(ymd);
                  $log.log(today);
                  if (today > ymd)
                    return true;
                }
              }
              return false;
            },
            message: '"Date of your offence must be a past date"'
          }
        }
      },
      {
        name: 'offence_details',
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
        name: 'message',
        key: 'message',
        type: 'customTextareaWithCounter',
        wrapper: 'note',
        templateOptions: {
          label: 'Message to the Magistrate',
          placeholder: 'Enter a message to be sent to the magistrate',
          maxlength: 600,
          prepend: "This might include explaining why you offended, your personal or financial circumstances, and things you would like the magistrate to consider when deciding your sentence ",
          modal_url: "js/partials/information-for-the-magistrate.html",
          form_field_note: 'show more'
        },
        ngModelAttrs: {
          form_field_note: {attribute: 'form-field-note'}
        }
      },
    ];

    $scope.loadModal = function(modal){
      var path = "js/partials/";
      $log.log("showing " + modal);
    };

    vm.fields.declaration = [
      {
        name: 'acknowledgement',
        key: 'acknowledgement',
        type: 'customCheckbox',
        templateOptions: {
          no_label: true,
          label: 'I acknowledge I may plead guilty or not guilty. I acknowledge no police officer or other person told me to plead guilty',
          required: true
        }
      },
      {
        name: 'plead_guilty',
        key: 'plead_guilty',
        type: 'customCheckbox',
        templateOptions: {
          no_label: true,
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
