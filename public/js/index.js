require('npm/lodash');
require('npm/angular');
require('npm/jquery');
require('npm/angular-cache');
require('npm/angular-formly');
require('npm/angular-formly-templates-bootstrap');
require('npm/angular-moment');
require('npm/angular-resource');
require('npm/angular-sanitize');
require('npm/angular-toastr');
require('npm/angular-ui-router');
require('npm/moment');
require('npm/ng-autocomplete');
require('npm/angular-strap/dist/angular-strap');
require('npm/angular-strap/dist/angular-strap.tpl');

// other assets
require('npm/bootstrap-additions/dist/bootstrap-additions.css');

var app = angular.module('njcOnlinePleas', [
  'ui.router',
  'angular-cache',
  'formly',
  'formlyBootstrap',
  'mgcrea.ngStrap',
  'ngAutocomplete',
  'toastr'
]);

// main app
require('./app')(app);

// controllers
require('./controllers/confirmation.controller')(app);
require('./controllers/form-confirmation.controller')(app);
require('./controllers/form.controller')(app);
require('./controllers/home.controller')(app);
require('./controllers/yes-no-modal.controller')(app);

// directives
require('./directives/form-steps.directive')(app);
require('./directives/formly-errors.directive')(app);
require('./directives/rating.directive')(app);

// services
require('./services/rating.service')(app);
