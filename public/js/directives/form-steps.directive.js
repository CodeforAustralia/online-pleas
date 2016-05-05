module.exports = function(app){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  app.directive('formSteps', function($log){
      return {
        restrict: "EA", // element or attribute only
        replace: true, // replace the element
        templateUrl: 'js/partials/form-steps.directive.html',
        scope: {
          'steps': '=',
          'current': '='
        },
        link: function(scope, elem, attrs){
          $log.log("Form steps directive");
          $log.log(scope);
          $log.log(elem);
          $log.log(attrs);
        }
      };
    });

};
