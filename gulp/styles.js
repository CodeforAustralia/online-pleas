/*
 * JS build steps
 * - dist task: compiles for distribution
 */
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./gulp.conf');
var series = require('stream-series');
var LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({ advanced: true }),
    autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });

// read all the gulp plugins in our dir
var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'main-bower-files', 'del']
});

gulp.task('styles:less:dist', function(){
  return gulp.src([
			path.join(conf.paths.src, '/less/app.less')
		])
    .pipe($.less({
			plugins: [autoprefix, cleancss]
		}))
    .pipe(gulp.dest(conf.paths.dist));
});

// build the styles for the distribution
gulp.task('styles:dist', ['styles:less:dist'], function(){
  return gulp.src([
      path.join(conf.paths.src, '/css/njc-base.css'),
      path.join(conf.paths.dist, '/app.css')
    ])
    .pipe($.filelog())
    .pipe($.sourcemaps.init())
    .pipe($.concat('main.css'))
		.pipe($.sourcemaps.write())
    .pipe($.rev()) // finger print the files for cache busting
	  .pipe(gulp.dest(conf.paths.dist))
		.pipe($.rev.manifest(conf.paths.manifest, conf.opts.rev))
	  .pipe(gulp.dest(conf.paths.dist))
	  .pipe($.size());
});

// build the vendor styles for the distribution
gulp.task('vendor:styles:dist', function(){
  var general = gulp.src([
    path.join(conf.paths.bower, '/bootstrap/**/bootstrap.min.css'),
  ]);
  var bower = gulp.src($.mainBowerFiles());
  var orderedStreams = series(general, bower);
  return orderedStreams
    .pipe($.filter('**/*.css'))
    .pipe($.sourcemaps.init())
    .pipe($.filelog())
    .pipe($.concat("vendor.css"))
    .pipe($.sourcemaps.write())
    .pipe($.rev()) // finger print the files for cache busting
    .pipe(gulp.dest(conf.paths.dist))
    .pipe($.rev.manifest(conf.paths.manifest, conf.opts.rev))
    .pipe(gulp.dest(conf.paths.dist))
    .pipe($.size());
});
