'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();
var webpackStream = require('webpack-stream');

module.exports = function(options) {
  function webpack(watch, callback) {
    var webpackOptions = require('../webpack.config')(watch);

    var webpackChangeHandler = function(err, stats) {
      if (err) {
        options.errorHandler('Webpack')(err);
      }

      $.util.log(stats.toString({
        colors: $.util.colors.supportsColor,
        chunks: false,
        hash: false,
        version: false
      }));

      browserSync.reload();

      if (watch) {
        watch = false;
        callback();
      }
    };

    return gulp.src(options.src + '/app.js')
      .pipe(webpackStream(webpackOptions, null, webpackChangeHandler))
      .pipe(gulp.dest(options.tmp + '/serve'));
  }

  gulp.task('scripts', function() {
    return webpack(false);
  });

  gulp.task('scripts:watch', ['scripts'], function(callback) {
    return webpack(true, callback);
  });
};
