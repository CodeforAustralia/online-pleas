// Dummy data service
module.exports = function(app){
  'use strict';

  /*ngInject*/
  app.service('RatingService', RatingService);

  /*ngInject*/
  function RatingService($log, $http){
    return {
      create: function(rating){
        return $http.post('ratings', rating);
      }
    };
  }
};
