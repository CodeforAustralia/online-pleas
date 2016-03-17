// elements

// Page object for the form
module.exports = {
  //var nameInput = element(by.model('yourName'));
  //var greeting = element(by.binding('yourName'));

  // TODO: Grab the url from the config file
  get: function() {
    browser.get('http://localhost:3000/');
  },

  getTitle: function(){
    var title = element(by.css('title'));
    return title.getText();
  },

  clickButton: function(name){
    element(by.buttonText(name)).click();
  },

  setName: function(name) {
    nameInput.sendKeys(name);
  },

  getGreeting: function() {
    return greeting.getText();
  }
};
