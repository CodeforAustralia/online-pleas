exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['test/form.spec.js'],
  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
    defaultTimeoutInterval: 30000,
  },

  capabilities: {
    browserName: 'firefox'
  },

  rootElement: '[ng-app]', // Tell protractor where the app root is
  // pretty jasmine reporter results
  onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: true,
      displaySuiteNumber: true
    }));

    //browser.driver.get("http://localhost:3000/");
  },

  //baseUrl: 'http://localhost:3000/',
  //getPageTimeout: 20000, // page load timeouts
  //allScriptsTimeout: 20000, // page sync timeouts

  /*multiCapabilities: [{
    browserName: 'firefox'
  }, {
    browserName: 'chrome'
  }]*/
};
