/*
 * Main entry point for our gulp tasks
 * Contains the build steps for the Online pleas
 * - dist task: compiles for distribution
 */
'use strict';

var path = require('path');
var gulp = require('gulp');
var series = require('stream-series');
var filter = require('gulp-filter');
var wrench = require('wrench');
var runSequence = require('run-sequence');
var conf = require('./gulp/gulp.conf');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});

/**
 * Task definitions
 */

//console.log(conf);

gulp.task('dist', ['clean:dist'], function(done){
  runSequence(
    [
      'vendor:scripts:dist',
      'vendor:styles:dist'
    ],
    [
      'scripts:dist',
    ],
    [
      'templates:dist',
    ],
    [
      'styles:dist',
    ]
    // TODO: maybe use inject later on, dont really need it atm
    ,
  done);
});

/*gulp.task('dist', function(callback){
  gulp.task('clean:dist',
    [
      'vendor:scripts:dist',
      'scripts:dist',
      'templates:dist',
    ],
    [
      'styles:dist',
      'vendor:styles:dist',
    ]
    //'inject:dist'
  , callback);
});*/

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
/*gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

// this is our main distribution build task
gulp.task('dist', function(callback){
	gulp.start('clean:dist', [
		'vendor:dist',
		'scripts:dist',
		'styles:dist',
		'inject:dist'
	]);
});

// read all the gulp plugins in our dir
var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'main-bower-files', 'run-sequence', 'del']
});

// this is our main distribution build task
gulp.task('dist', function(callback){
	gulp.start('clean:dist', [
		'vendor:scripts:dist',
		'scripts:dist',
		'styles:dist',
		'inject:dist'
	]);
});

// Clean the dist dir
gulp.task('clean:dist', function(done){
	$.del([path.join(conf.paths.dist)], done);
});

// Prepare the vendorjs file
gulp.task('vendor:dist', function(done){
		// jquery and angular have to load before all the other libs
    // this is angularFileSort isnt ordering the files correctly - something up with ui-bootstrap.tpls.js
    var jqueryScript = gulp.src([
      path.join(conf.paths.bower, '/jquery/dist/*.min.js'),
      path.join(conf.paths.bower, '/moment/min/moment.min.js'),
    ]);

    var ngScript = gulp.src([
      path.join(conf.paths.bower, '/angular/angular.min.js')
    ]);

    var otherScript = gulp.src($.mainBowerFiles())
                        .pipe($.filter(['** /*.js','!** /angular.min.js','!** /angular.js','!** /jquery.min.js','!** /jquery.js','!** /moment.min.js','!** /moment.js'])) // get all the js files, dont include angular twice
                        .pipe($.angularFilesort());

	var orderedStreams = series(jqueryScript, ngScript, otherScript);
	// build vendor js, angular and other js files first
  return orderedStreams
    .pipe($.filter(['** /*.js']))
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'))
    .pipe($.filelog())
    .pipe($.uglify())
    .pipe($.concat("vendor.js"))
    .pipe(gulp.dest(conf.paths.dist))
    .pipe($.size());
});

// preare the js scripts
gulp.task('scripts:dist', function(done){});

// prepare the styles
gulp.task('styles:dist', function(done){});

// inject the files into the final view
gulp.task('inject:dist', function(done){});*/
