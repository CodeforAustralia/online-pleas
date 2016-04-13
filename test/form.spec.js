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
    return title.getText().then(function(text){
      return text.toLowerCase();
    });
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
      'birthday': element(by.name('birthday')),
      /*'birthday_day': element(by.name('birthday[\'day\']')),
      'birthday_month': element(by.name('birthday[\'month\']')),
      'birthday_year': element(by.name('birthday[\'year\']')),*/
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
      'birthday': "18/6/1988",
      'contact_method': 'phone',
      'contact': "0040123456",
    },
    'offence': {
      'hearing_date': formatDateDDMMYY({day: 19, month: d.getMonth()+2, year: d.getFullYear()}),
      'offence_date': formatDateDDMMYY({day: 1, month: d.getMonth()+1, year: d.getFullYear()}),
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


  function formatDateDDMMYY(date){
    // convert the date to YMD
    var d = new Date(date.year, date.month-1, date.day);
    var mon = d.getMonth()+1;
    mon = String(mon).length === 2 ? mon : "0"+String(mon);
    var day = d.getDate();
    day = String(day).length === 2 ? day : "0"+String(day);
    return day + "/" + mon + "/" + d.getFullYear();
  }

  function selectDropdownbyNum(element, index) {
    //element.findElements(by.tagName('option'))
    element(by.name('contact_method')).then(function(e){
      e.findElements(by.tagName('option'))
      .then(function(options) {
        options[index].click();
      });
    });
  }

  this.fillField = function(form, field, value){
    fields[form][field].sendKeys(value);
  };

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
    return element(by.css(".alert .alert-title")).getText().then(function(text){
      return text.toLowerCase();
    });
  };

  this.getAlertMessageText = function(){
    return element(by.css(".alert .alert-message")).getText().then(function(text){
      return text.toLowerCase();
    });
  };
};

function fillYourDetails(opf){
  // fill in the form
  opf.fillForm('details');
  opf.clickButton('Next');
}

function fillYourOffence(opf){
  // fill in the form
  opf.fillForm('offence');
  opf.clickButton('Next');
}

function fillDeclarations(opf){
  opf.fillForm('declaration');
  opf.clickButton('Next');
}

describe('Online pleas', function() {
  describe('Home', function() {
    //beforeEach
    beforeEach(function(){
      browser.driver.get("http://localhost:3000/");
    });

    it('should have a title and begin button', function(){
      //var txt = element(by.css("main .header-title"));
      var op = new OnlinePleasHome();
      expect(op.getTitle()).toEqual("submit your plea online");
      expect(op.getButton('Begin').isDisplayed()).toBe(true);
    });

    it('should let me click the "some offences" link and see the types of offences', function(){
      var op = new OnlinePleasHome();
      var offences = [
        'Transport offences (unpaid infringements)',
        'Road safety offences',
        'Theft: shop stealing, theft of bicycle, or theft from car (max $600)',
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

  describe('Form', function(){
    //beforeEach
    beforeEach(function(){
      browser.driver.get("http://localhost:3000/");
    });

    it('should let me successfully submit the form', function(){
      var opf = new OnlinePleasForm();

      opf.clickButton('Begin');

      // should see the your details form
      fillYourDetails(opf);

      // should see the your offence form
      fillYourOffence(opf);

      // should see the your declarations form
      fillDeclarations(opf);
      // submit the form
      opf.clickButton('Submit');

      expect(opf.getAlertHeadingText()).toBe("submitted");
      expect(opf.getAlertMessageText()).toBe("your guilty plea has been submitted.");
    });

    it('should not let me submit the form if there are errors', function(){
      var opf = new OnlinePleasForm();

      opf.clickButton('Begin');

      // should see the your details form
      fillYourDetails(opf);

      // try and proceed without filling in the second screen
      opf.clickButton('Next');
      //browser.pause();
      expect(opf.getAlertHeadingText()).toBe("form errors");
      expect(opf.getAlertMessageText()).toContain("to continue, please fix these errors...");
    });

    it('should let me cancel and exit the form', function(){
      /*var opf = new OnlinePleasForm();

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
      expect(opf.getAlertMessageText()).toBe("Your guilty plea has been submitted.");*/
    });
  });

  describe('Your details', function(){
    var opf = new OnlinePleasForm();

    beforeEach(function(){
      browser.driver.get("http://localhost:3000/");
      opf.clickButton('Begin');
    });

    it('should make sure the date of birth is a past date', function(){
      var y = new Date().getFullYear()+1;
      // selecvt a date next year
      opf.fillField('details', 'birthday', '18/06/' + y);
      opf.clickButton('Next');
      //browser.pause();
      expect(opf.getAlertHeadingText()).toBe("form errors");
      expect(opf.getAlertMessageText()).toContain("to continue, please fix these errors...");
      expect(opf.getAlertMessageText()).toContain("date of birth must be a past date");
    });
  });

  describe('Your offence', function(){
    var opf = new OnlinePleasForm();

    beforeEach(function(){
      browser.driver.get("http://localhost:3000/");
      var opf = new OnlinePleasForm();
      opf.clickButton('Begin');
      fillYourDetails(opf);
    });

    it('should make sure the offence and hearing date dont fail with a short month / year', function(){
      var y = new Date().getFullYear()+1;
      // selecvt a date next year
      opf.fillField('offence', 'offence_date', '18/6/' + String(y-2).replace("20", ""));
      opf.fillField('offence', 'hearing_date', '19/6/' + y);
      opf.clickButton('Next');
      //browser.pause();
      expect(opf.getAlertHeadingText()).toBe("form errors");
      expect(opf.getAlertMessageText()).toContain("to continue, please fix these errors...");
      expect(opf.getAlertMessageText()).not.toContain("date of your offence must be a past date");
      expect(opf.getAlertMessageText()).not.toContain("date of your hearing must be a future date");
    });

    it('should make sure the offence date is in the past', function(){
      var y = new Date().getFullYear()+1;
      // selecvt a date next year
      opf.fillField('offence', 'offence_date', '18/06/' + y);
      opf.clickButton('Next');
      //browser.pause();
      expect(opf.getAlertHeadingText()).toBe("form errors");
      expect(opf.getAlertMessageText()).toContain("to continue, please fix these errors...");
      expect(opf.getAlertMessageText()).toContain("date of your offence must be a past date");
    });

    it('should make sure the hearing date is in the future', function(){
      var y = new Date().getFullYear()-1;
      // selecvt a date next year
      opf.fillField('offence', 'hearing_date', '18/06/' + y);
      opf.clickButton('Next');
      //browser.pause();
      expect(opf.getAlertHeadingText()).toBe("form errors");
      expect(opf.getAlertMessageText()).toContain("to continue, please fix these errors...");
      expect(opf.getAlertMessageText()).toContain("date of your hearing must be a future date");
    });

    it('should make sure the hearing date can be close to the current day', function(){
      var y = new Date().getFullYear();
      var m = new Date().getMonth();
      var d = new Date().getDate()+1;
      var date = new Date(y, m, d);
      // selecvt a date next year
      opf.fillField('offence', 'hearing_date', date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
      opf.clickButton('Next');
      //browser.pause();
      expect(opf.getAlertHeadingText()).toBe("form errors");
      expect(opf.getAlertMessageText()).toContain("to continue, please fix these errors...");
      expect(opf.getAlertMessageText()).not.toContain("date of your hearing must be a future date");
    });

    it('should make sure the offence date can be a date can be close to the current day', function(){
      var y = new Date().getFullYear();
      var m = new Date().getMonth();
      var d = new Date().getDate()-1;
      var date = new Date(y, m, d);
      // selecvt a date next year
      opf.fillField('offence', 'offence_date', date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
      opf.clickButton('Next');
      //browser.pause();
      expect(opf.getAlertHeadingText()).toBe("form errors");
      expect(opf.getAlertMessageText()).toContain("to continue, please fix these errors...");
      expect(opf.getAlertMessageText()).not.toContain("date of your offence must be a past date");
    });
  });


  describe('Your declaration', function(){
    var opf = new OnlinePleasForm();

    beforeEach(function(){
      browser.driver.get("http://localhost:3000/");
      var opf = new OnlinePleasForm();
      opf.clickButton('Begin');
      fillYourDetails(opf);
      fillYourOffence(opf);
    });

    it('should make sure both declarations are selected', function(){
      opf.clickButton('Next');

      expect(opf.getAlertHeadingText()).toBe("form errors");
      expect(opf.getAlertMessageText()).toContain("to continue, please fix these errors...");
      expect(opf.getAlertMessageText()).toContain("I acknowledge I may plead guilty or not guilty. I acknowledge no police officer or other person told me to plead guilty is required".toLowerCase());
      expect(opf.getAlertMessageText()).toContain("I plead guilty to the offence(s) listed in this form. This plea is entered voluntarily of my own free will is required".toLowerCase());
    });
  });

});
