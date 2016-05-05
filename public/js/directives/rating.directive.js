module.exports = function(app){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  app.directive('rating', function ($log) {
      return {
        restrict: "EA", // element or attribute only
        replace: true, // replace the element
        templateUrl: 'js/partials/rating.directive.html',
        scope: {
        },
        controllerAs: 'vm',
        controller: function($scope, $log, RatingService){
          var vm = this;
          $log.log("Controller");

          vm.submitted = false;

          vm.model = {};
          vm.rating_options = [
            {"label": 1, "value": 1, "value_text": "Very difficult"},
            {"label": 2, "value": 2},
            {"label": 3, "value": 3},
            {"label": 4, "value": 4},
            {"label": 5, "value": 5},
            {"label": 6, "value": 6},
            {"label": 7, "value": 7, "value_text": "Very easy"}
          ];

          vm.fields = [
            {
              type: 'customRatingRadio',
              key: 'rating',
              templateOptions: {
                label: "Overall, how difficult or easy did you find this task?",
                labelProp: 'label',
                valueProp: 'value',
                required: true,
                options: vm.rating_options
              }
            },
            {
              type: 'textarea',
              key: 'comments',
              templateOptions: {
                label: "Comments",
                required: false
              }
            }
          ];

          vm.submit = function(){
            RatingService
              .create(vm.model)
              .then(function(data){
                vm.submitted = true;
              }, function(err){
                $log.log(err);
              });
          };
        },
        link: function(scope, elem, attrs){
          $log.log("Rating directive");
          $log.log(scope);
          $log.log(elem);
          $log.log(attrs);
        }
      };
    });

};
