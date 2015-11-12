'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var nodemon = require('gulp-nodemon');

var util = require('util');

var middleware = require('./proxy')();

module.exports = function(options) {

  function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    if (baseDir === options.src || (util.isArray(baseDir) && baseDir.indexOf(options.src) !== -1)) {
      routes = {
        '/bower_components': 'bower_components'
      };
    }

    var server = {
      baseDir: baseDir,
      routes: routes
    };

    if (middleware.length > 0) {
      server.middleware = middleware;
    }

    browserSync.instance = browserSync.init({
      startPath: '/',
      server: server,
      browser: browser,
      port: 8080
    });
  }

  // Only needed for angular apps
  browserSync.use(browserSyncSpa({
    selector: '[ng-app]'
  }));

  gulp.task('nodemon', function(cb) {
    return nodemon({
      script: 'server.js'
    }).on('start', function() {
      cb();
    });
  });

  gulp.task('serve', ['watch'], function() {
    browserSyncInit([options.tmp + '/serve', options.src]);
  });

  gulp.task('serve:local', ['watch'], function() {
    middleware = require('./proxy')('http://localhost:9001');
    browserSyncInit([options.tmp + '/serve', options.src]);
  });

  gulp.task('serve:dist', ['build'], function() {
    browserSyncInit(options.dist);
  });

  gulp.task('serve:e2e', ['inject'], function() {
    browserSyncInit([options.tmp + '/serve', options.src], []);
  });

  gulp.task('serve:e2e-dist', ['build'], function() {
    browserSyncInit(options.dist, []);
  });
};
