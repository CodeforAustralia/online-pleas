/*
 * Contains the build steps cleaning tasks
 */
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./gulp.conf');

// read all the gulp plugins in our dir
var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'main-bower-files', 'run-sequence', 'del']
});

// Clean the dist dir
gulp.task('clean:dist', function(){
	$.del([path.join(conf.paths.dist)]);
});