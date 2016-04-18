// Dummy data service
(function(){
  'use strict';

  /*ngInject*/
  angular.module('njcOnlinePleas')
    .service('RatingService', RatingService);

  /*ngInject*/
  function RatingService($log, $http){

    return {
      create: function(rating){
        return $http.post('ratings', rating);
      }
    };
  }
})();
