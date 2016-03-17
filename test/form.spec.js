var _ = require('lodash');

var OnlinePleasHome = function() {
  //var nameInput = element(by.model('yourName'));
  //var greeting = element(by.binding('yourName'));
  var title = element(by.css('main .header-title'));
  var someOffences = element(by.linkText('some offences'));
  var offencesModal = element(by.css('main .modal-dialog'));
  var offences = element.all(by.css('main .modal-dialog .modal-body ul li'));

  /*this.get = function() {
    browser.driver.get('http://localhost:3000/');
  };

  this.setName = function(name) {
    nameInput.sendKeys(name);
  };

  this.getGreeting = function() {
    return greeting.getText();
  };*/

  this.getTitle = function() {
    return title.getText();
  };


  this.getSomeOffences = function() {
    return someOffences.getText();
  };

  this.getOffencesModal = function(){
    return offencesModal;
  };

  this.getButton = function(name){
    return element(by.buttonText(name));
  };

  this.getOffences = function(){
    return offences;
  };
};

var OnlinePleasForm = function(){
  var fields = {
    'given_name': element(by.name('given_name')),
    'family_name': element(by.name('family_name')),
    'address': element(by.name('address')),
    'birthday_day': element(by.name('birthday[\'day\']')),
    'birthday_month': element(by.name('birthday[\'month\']')),
    'birthday_year': element(by.name('birthday[\'year\']')),
    'contact_method': element(by.name('contact_method')),
    'contact': element(by.name('contact')),
  };

  var values = {
    'given_name': 'Joe',
    'family_name': 'Bloggs',
    'address': '123 Fake St, Vic, 3000',
    'birthday_day': 6,
    'birthday_month': 8,
    'birthday_year': 1990,
    'contact_method': 'phone',
    'contact': "0040123456",
  };

  var dropdowns = [
    'contact_method'
  ];

  function selectDropdownbyNum(element, index) {
    //element.findElements(by.tagName('option'))
    element(by.name('contact_method')).then(function(e){
      e.findElements(by.tagName('option'))
      .then(function(options) {
        options[index].click();
      });
    });
       /*.then(function(options) {
         options[index].click();
       });*/
    /*if (optionNum){
      var options = element.findElements(by.tagName('option'))
        .then(function(options){
          options[optionNum].click();
        });
    }*/
  }

  this.fillInMyDetails = function(){
    _.each(fields, function(field, key){
      //console.log(key);
      //if (dropdowns.indexOf(key) >= 0)
        //selectDropdownbyNum(field, 1);
      //else
        field.sendKeys(values[key]);
    });
  };

  this.clickButton = function(name){
    return element(by.buttonText(name)).click();
  };
};

describe('Online pleas', function() {
  describe('Home', function() {
    //beforeEach
    beforeEach(function(){
      browser.driver.get("http://localhost:3000/");
    });

    it('should have a title and begin button', function(){
      //var txt = element(by.css("main .header-title"));
      var op = new OnlinePleasHome();
      expect(op.getTitle()).toEqual("submit your plea online".toUpperCase());
      expect(op.getButton('Begin').isDisplayed()).toBe(true);
    });

    it('should let me click the "some offences" link and see the types of offences', function(){
      var op = new OnlinePleasHome();
      var offences = [
        'Transport offences (unpaid infringements)',
        'Traffic-related offences',
        'Theft - shop stealing; theft of bicycle; theft from motor car',
        'Drunk in a public place',
      ];
      op.getSomeOffences().click();

      // make sure the modal loads
      expect(op.getOffencesModal().isDisplayed()).toBe(true);

      // go through the offences and check they are the correct ones
      op.getOffences().each(function(element, index) {
        element.getText().then(function (text) {
          expect(offences).toContain(text);
        });
      });
    });

  });

  fdescribe('Form', function() {
    //beforeEach
    beforeEach(function(){
      browser.driver.get("http://localhost:3000/");
    });

    it('should let me submit the form', function(){
      var op = new OnlinePleasForm();

      op.clickButton('Begin');

      // should see the your details form
      // fill in the form
      op.fillInMyDetails();
      browser.pause();
      // go to the next page
    });
  });

});
