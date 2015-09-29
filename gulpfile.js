'use strict';

var gulp = require('gulp');
var cache = require('gulp-cached');
var del = require('del');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var changed = require('gulp-changed');
var info = require('./package.json');

// -- CONSTANTS ---------------------------------------------------------------
var TARGET = './~public/'

var JS_SRC = [
  './index.js',
  './core/**/*.js',
  './modules/**/*.js'
];

var APP_SRC = [
  './modules/**/web/**/index.js',
  './modules/**/web/**/!(index)*!(.spec).js'
]

var WEB_SRC = [
  './modules/**/web/**/!(*.js)'
];

var SASS_SRC = [
  './modules/**/web/**/*.scss'
];

var TEST_API_SRC = [
  './index.spec.js',
  './core/**/*.spec.js',
  './modules/**/api/**/*.spec.js'
];

// -- LINT --------------------------------------------------------------------

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('jshint', function () {

  var jshint = require('gulp-jshint');

  return gulp.src(JS_SRC)
  .pipe(cache('jshint'))
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('jscs', function () {

  var jscs = require('gulp-jscs');

  return gulp.src(JS_SRC)
  .pipe(cache('jscs'))
  .pipe(jscs());

});

// -- BUILD -------------------------------------------------------------------

gulp.task('build', ['clean', 'build-web', 'build-sass', 'build-app']);

gulp.task('clean', function () {
  return del.sync(TARGET, { force: true });
});

gulp.task('build-web', function () {

  return gulp.src(WEB_SRC, { base: './modules' })
  .pipe(changed(TARGET))
  .pipe(rename(function (path) {
    path.dirname = path.dirname.replace(/[\\/]web/, '');
    if (path.dirname.indexOf('_base') > -1) {
      path.dirname = path.dirname.replace('_base', '');
    } else {
      path.dirname = 'modules/' + path.dirname;
    }
  }))
  .pipe(gulp.dest(TARGET));

});

gulp.task('build-sass', function () {

  return gulp.src(SASS_SRC)
  .pipe(changed(TARGET))
  .pipe(concat('style.scss'))
  .pipe(sass({ style: 'compressed' }))
  .pipe(autoprefixer({
    browsers: ['last 4 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(TARGET));

});

gulp.task('build-app', function () {

  return gulp.src(APP_SRC)
  .pipe(changed(TARGET))
  .pipe(sourcemaps.init())
    .pipe(concat(info.name + '.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(TARGET));

  });

// -- RUN ---------------------------------------------------------------------

gulp.task('default', ['run']);

gulp.task('run', ['build'], function () {

  var nodemon = require('nodemon');
  var path = require('path');

  gulp.watch(SASS_SRC, ['build-sass']);
  gulp.watch(WEB_SRC, ['build-web']);
  gulp.watch(APP_SRC, ['build-app']);
  nodemon({
    script: './index.js',
    watch: [
      path.join(__dirname, './index.js'),
      path.join(__dirname, './core/**/*.js'),
      path.join(__dirname, './modules/**/*.js'),
      path.join(__dirname, './~public/**/*')
    ]
  });

});

gulp.task('dev', ['run'], function () {

  var browserSync = require('browser-sync');
  var config = require('./config')

  browserSync({
    proxy: 'localhost:' + config.server.port + '/',
    port: 8080
  });
  gulp.watch([
    TARGET + '**/*'
  ], browserSync.reload);

});

// -- TEST --------------------------------------------------------------------

gulp.task('test', ['test-api']);

gulp.task('test-api', function () {

  var util = require('gulp-util')
  var reporter = util.env.spec ? 'spec' : 'dot';
  var mocha = require('gulp-mocha');

  return gulp.src(TEST_API_SRC)
  .pipe(mocha({ reporter: reporter }));

});

gulp.task('test-web', ['build-web'], function (done) {

  var karma = require('karma');
  var server = new karma.Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done);
 
  return server.start();

});

gulp.task('cover', ['test-web'], function (done) {

  var istanbul = require('gulp-istanbul');
  var mocha = require('gulp-mocha');
  var istanbulReport = require('gulp-istanbul-report');

  gulp.src(JS_SRC)
  .pipe(istanbul({ includeUntested: true }))
  .pipe(istanbul.hookRequire())
  .on('finish', function () {
    gulp.src(TEST_API_SRC)
    .pipe(mocha({ reporter: 'dot' }))
    .pipe(istanbul.writeReports({ dir: './coverage/api',  reporters: [ 'json' ] }))
    .on('end', function (err) {
      if (!err) { 

        gulp.src('./coverage/**/coverage-final.json')
        .pipe(istanbulReport({
          reporters: [
            'text', 'text-summary',
            { name: 'lcov', dir: 'coverage'} 
          ]
        })  );

      } else {
        return done(err) 
        
      };
    });
  });

});

// -- DATA --------------------------------------------------------------------

gulp.task('load-data', ['load-mongo', 'load-redis']);

gulp.task('load-mongo', function () {
  require('./test/data/loadMongo');
});

gulp.task('load-redis', function () {
  require('./test/data/loadRedis');
});
