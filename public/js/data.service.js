(function(){

  angular.module('njcEfvApp')
    .service('DataSource', DataSource);

  function DataSource(){
    var data = [
      {id: "fvio-125", date: "03 Dec 2015", type: "FVIO", name: "Applicant nine", allocated_to: "jerram", status: "Lodged", review: "Review", risk: "High risk", address: "21 Jump St<br/>Faketown Hill, 3000", phone: "0400111333"},
      {id: "fvio-124", date: "03 Dec 2015", type: "FVIO", name: "Applicant nine", allocated_to: "jerram", status: "Lodged", risk: "High risk", address: "22 Jump St<br/>Fakeave Cove, 3000", phone: "0400222444"},
      {id: "fvio-123", date: "02 Dec 2015", type: "FVIO", name: "Applicant nine", allocated_to: "jerram", status: "Lodged", risk: "Urgent", address: "23 Jump St<br/>Fakecity Grove, 3000", phone: "0422111555"},
      {id: "fvio-122", date: "01 Dec 2015", type: "FVIO", name: "Applicant nine", allocated_to: "jerram", status: "Lodged", review: "Review", risk: "Urgent", address: "24 Jump St<br/>Fakeville Trail, 3000", phone: "0422000111"},
      {id: "fvio-121", date: "03 Dec 2015", type: "FVIO", name: "Applicant nine", allocated_to: "jerram", status: "Lodged", review: "Review", risk: "High risk", address: "25 Jump St<br/>Fake Crescent, 3000", phone: "0424040242"},
    ];

    return {
      get: function(){
        return data;
      },

      find: function(id){
        return _.findWhere(data, {id: id});
      }
    };
  }

})();
