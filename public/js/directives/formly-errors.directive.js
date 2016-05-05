module.exports = function(app){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  app.directive('formlyErrorSummary', function($log) {
    return {
      scope: {},
      bindToController: {
        form: '=',
        fields: '='
      },
      templateUrl: 'js/partials/formly-error-summary.directive.html',
      controllerAs: 'vm',
      controller: function() {
        var vm = this;

        vm.getErrorAsList = getErrorAsList;

        function getErrorAsList(field) {
          return Object.keys(field.formControl.$error).map(function(error) {
            // note, this only works because the customInput type we have defined.
            return field.data.getValidationMessage(error);
          }).join(', ');
        }
      }
    };
  });

};
