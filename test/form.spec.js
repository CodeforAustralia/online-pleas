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
    'details': {
      'given_name': element(by.name('given_name')),
      'family_name': element(by.name('family_name')),
      'address': element(by.name('address')),
      'birthday_day': element(by.name('birthday[\'day\']')),
      'birthday_month': element(by.name('birthday[\'month\']')),
      'birthday_year': element(by.name('birthday[\'year\']')),
      'contact_method': element(by.name('contact_method')),
      'contact': element(by.name('contact')),
    },
    'offence': {
      'hearing_date': element(by.name('hearing_date')),
      'offence_date': element(by.name('offence_date')),
      'offence_details': element(by.name('offence_details')),
      'message': element(by.name('message'))
    },
    'declaration': {
      'acknowledgement': element(by.name('acknowledgement')),
      'plead_guilty': element(by.name('plead_guilty')),
    }
  };

  var d = new Date();
  var monthnames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];

  var values = {
    'details': {
      'given_name': 'Joe',
      'family_name': 'Bloggs',
      'address': '123 Fake St, Vic, 3000',
      'birthday_day': 6,
      'birthday_month': 8,
      'birthday_year': 1990,
      'contact_method': 'phone',
      'contact': "0040123456",
    },
    'offence': {
      'hearing_date': '19 ' + monthnames[d.getMonth()].slice(0,3) + " " + d.getFullYear(),
      'offence_date': '01 ' + monthnames[d.getMonth()].slice(0,3) + " " + d.getFullYear(),
      'offence_details': 'I stole a coffee',
      'message': 'I was thirsty'
    },
    'declaration': {
      'acknowledgement': true,
      'plead_guilty': true
    }
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
  }

  this.fillForm = function(form){
    var v = values[form];
    _.each(fields[form], function(field, key){
      if (v[key] === true)
        field.click();
      else
        field.sendKeys(v[key]);
    });
  };

  this.clickButton = function(name){
    return element(by.buttonText(name)).click();
  };

  this.getAlertHeadingText = function(){
    return element(by.css("#confirmation .alert h2")).getText();
  };

  this.getAlertMessageText = function(){
    return element(by.css("#confirmation .alert p")).getText();
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

  describe('Form', function() {
    //beforeEach
    beforeEach(function(){
      browser.driver.get("http://localhost:3000/");
    });

    it('should let me successfully submit the form', function(){
      var opf = new OnlinePleasForm();

      opf.clickButton('Begin');

      // should see the your details form
      // fill in the form
      opf.fillForm('details');
      opf.clickButton('Next');
      //browser.pause();
      opf.fillForm('offence');
      opf.clickButton('Next');
      //browser.pause();
      // go to the next page
      //browser.pause();
      opf.fillForm('declaration');
      opf.clickButton('Next');
      // submit the form
      opf.clickButton('Submit');

      expect(opf.getAlertHeadingText()).toBe("Submitted");
      expect(opf.getAlertMessageText()).toBe("Your guilty plea has been submitted.");
    });
  });

});
