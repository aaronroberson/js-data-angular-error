'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var neat = require('node-neat').includePaths;

var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer-core');

var wiredep = require('wiredep').stream;

module.exports = function(options) {
  gulp.task('styles', function() {
    var sassOptions = {
      style: 'expanded',
      includePaths: ['./src'].concat(neat)
    };

    var injectFiles = gulp.src([
      options.src + '/**/**/*.scss',
      '!' + options.src + '/app.scss',
      '!' + options.src + '/vendor.scss'
    ], {read: false});

    var injectOptions = {
      transform: function(filePath) {
        filePath = filePath.replace(options.src + '/**/', '');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    };

    var indexFilter = $.filter('app.scss');
    var vendorFilter = $.filter('vendor.scss');

    return gulp.src([
      options.src + '/app.scss',
      options.src + '/vendor.scss'
    ])
      .pipe(indexFilter)
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(indexFilter.restore())
      .pipe(vendorFilter)
      .pipe(wiredep(options.wiredep))
      .pipe(vendorFilter.restore())
      .pipe($.sourcemaps.init())
      .pipe($.sass(sassOptions)).on('error', options.errorHandler('Sass'))
      .pipe($.postcss([autoprefixer({browsers: ['last 2 version']})])).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(options.tmp + '/serve/'))
      .pipe(browserSync.reload({stream: true}));
  });
};
