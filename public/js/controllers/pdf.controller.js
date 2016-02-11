(function(){
  'use strict';
  // App bootstrapping + DI
  /*@ngInject*/
  angular.module('njcEfvApp')
    .controller('PDFController', PDFController);

  /*@ngInject*/
  function PDFController($scope, $log, $rootScope){

    // $scope.pdfUrl = "/pdfs/sample-1.pdf";
    $scope.pdfUrl = "/pdfs/sample-combined.pdf";
    //$scope.loading = 'loading your document...';
    $scope.loading = true;

    $scope.onLoad = function() {
      // finishsed loading
      $scope.loading = false;
    };

    function init(){
      $log.log("Loaded the pdf controller");
    }

    init();
  }

})();
