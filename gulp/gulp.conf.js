/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

 /*
 * Re-organize the src dir into modules instead of sass / js dirs
 */

var gutil = require('gulp-util');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  appViews: './views',
  bower: './public/vendor',
  src: './public',
  dist: './public/dist',
  tmp: '.tmp',
  e2e: './test',
  manifest: './public/dist/rev-manifest.json' // based on this open issue: https://github.com/sindresorhus/gulp-rev/issues/83
};

exports.opts = {
  rev: {
    base: './public/dist',
    merge: true
  }
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/jquery/, /bootstrap.js$/, /bootstrap\.css/],
  directory: './public/vendor'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
