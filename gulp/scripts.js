/*
 * JS build steps
 * - dist task: compiles for distribution
 */
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./gulp.conf');
var series = require('stream-series');

// read all the gulp plugins in our dir
var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'main-bower-files', 'del']
});

// preare the js scripts
gulp.task('scripts:dist', function(done){
  // load config scripts first
  var configs = gulp.src([
      path.join(conf.paths.src,"/js/modules.js"),
      path.join(conf.paths.src,"/js/app.js")
  ]);

  // load the app scripts after
  var app = gulp.src([
      path.join(conf.paths.src, '/js/**/*.js'),
      '!'+path.join(conf.paths.src, '/js/modules.js'),
      '!'+path.join(conf.paths.src, '/js/app.js')
  ]);

  var orderedStreams = series(configs, app);
  return orderedStreams
    .pipe($.filter(['**/*.js']))
    .pipe($.filelog()) // used to output the list of files passing through the stream
    // should only need jshint for the watch / local build step
    //.pipe($.jshint())
    //.pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.sourcemaps.init())
    .pipe($.stripDebug())
    .pipe($.stripNgLog())
    .pipe($.concat('main.js'))
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.sourcemaps.write())
    .pipe($.rev()) // finger print the files for cache busting
    .pipe(gulp.dest(conf.paths.dist))
    .pipe($.rev.manifest(conf.paths.manifest, conf.opts.rev))
    .pipe(gulp.dest(conf.paths.dist))
    .pipe($.size());
});

// build our html template files
gulp.task('templates:dist', function(done){
  return gulp.src([
    path.join(conf.paths.src, '/js/**/*.html')
  ])
  .pipe($.filelog()) // used to output the list of files passing through the stream
  .pipe($.sourcemaps.init())
  .pipe($.minifyHtml({
    empty: true,
    spare: true,
    quotes: true
  }))
  //.pipe($.replace('src="/images', 'src="/assets/images')) // fix src image urls
  .pipe($.angularTemplatecache('templates.js', {
    module: 'njcOnlinePleas',
    root: 'js'
  }))
  .pipe($.sourcemaps.write())
  .pipe($.rev()) // finger print the files for cache busting
  .pipe(gulp.dest(conf.paths.dist))
  .pipe($.rev.manifest(conf.paths.manifest, conf.opts.rev))
  .pipe(gulp.dest(conf.paths.dist))
  .pipe($.size());
});

// prepare the vendor scripts
gulp.task('vendor:scripts:dist', function(done){
	// jquery and angular have to load before all the other libs
    // this is angularFileSort isnt ordering the files correctly - something up with ui-bootstrap.tpls.js
    var jqueryScript = gulp.src([
			path.join(conf.paths.bower, '/moment/min/moment.min.js'),
      path.join(conf.paths.bower, '/jquery/dist/jquery.min.js'),
    ]);

    var ngScript = gulp.src([
      path.join(conf.paths.bower, '/angular/angular.min.js')
    ]);

    var otherScript = gulp.src($.mainBowerFiles())
                        .pipe($.filter([
                        	'**/*.js',
													'!**/angular-google-places-autocomplete/src/*',
                        	'!**/angular.min.js',
                        	'!**/angular.js',
                        	'!**/jquery.min.js',
                        	'!**/jquery*.js',
                        	'!**/moment*.js'])) // get all the js files, dont include angular twice
                        .pipe($.angularFilesort());

	var orderedStreams = series(otherScript, ngScript, jqueryScript);
	// build vendor js, angular and other js files first
	return orderedStreams
		.pipe($.filter(['**/*.js', '!**/less.js']))
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'))
		.pipe($.filelog())
    .pipe($.sourcemaps.init())
		.pipe($.uglify())
		.pipe($.concat("vendor.js"))
    .pipe($.sourcemaps.write())
    .pipe($.rev()) // finger print the files for cache busting
    .pipe(gulp.dest(conf.paths.dist))
    .pipe($.rev.manifest(conf.paths.manifest, conf.opts.rev))
		.pipe(gulp.dest(conf.paths.dist))
		.pipe($.size());
});
