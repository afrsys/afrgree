(function () {

  'use strict';

  var gulp = require('gulp');
  var util = require('gulp-util');
  var nodemon = require('gulp-nodemon');
  var jshint = require('gulp-jshint');
  var jscs = require('gulp-jscs');
  var mocha = require('gulp-mocha');
  var cache = require('gulp-cached');
  var changed = require('gulp-changed');
  var istanbul = require('gulp-istanbul');
  var del = require('del');
  var concat = require('gulp-concat');
  var sass = require('gulp-sass');
  var uglify = require('gulp-uglify');
  var sourcemaps = require('gulp-sourcemaps');
  var ngAnnotate = require('gulp-ng-annotate');
  var autoprefixer = require('gulp-autoprefixer');
  var runSequence = require('run-sequence');
  var browserSync = require('browser-sync');
  var path = require('path');
  var reload = browserSync.reload;

  var jsSources = [
    './*.js',
    './test/**/*.js',
    './main/api/**/*.js',
    './main/web/**/*.js'
  ];

  gulp.task('jshint', function () {
    return gulp.src(jsSources)
      .pipe(cache('jshint'))
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  });

  gulp.task('jscs', function () {
    return gulp.src(jsSources)
      .pipe(cache('jscs'))
      .pipe(jscs());
  });

  gulp.task('lint', ['jshint', 'jscs']);

  gulp.task('test', testTask);

  function testTask() {

    var reporter = util.env.spec ? 'spec' : 'dot';

    return gulp.src('./main/api/**/*.spec.js')
      .pipe(cache('test'))
      .pipe(mocha({ reporter: reporter }));

  }

  gulp.task('cover', function (cb) {
    gulp.src('./main/api/**/!(*.spec).js')
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
      .on('finish', function () {
        testTask()
          .pipe(istanbul.writeReports({ dir: './target/coverage' }))
          .on('end', function () {

            var coverage = istanbul.summarizeCoverage();

            if (coverage.lines.pct < 80 || coverage.statements.pct < 80 ||
                coverage.functions.pct < 80 && coverage.branches.cpt < 80) {
              return cb(new Error('ERROR: some coverage below ' + 80 + '%'));
            }
            cb();

          });
      });
  });

  gulp.task('build', function (cb) {
    runSequence('clear', 'test', [
      'build-web',
      'build-app',
      'build-sass',
      'build-api'
    ], cb);
  });

  gulp.task('build-web', function () {
    return gulp.src(['./main/web/**/*.{html,ico,png,jpg,jpeg,gif}'], { base: './main' })
      .pipe(changed('./target/build/'))
      .pipe(gulp.dest('./target/build/'));
  });

  gulp.task('build-api', function () {
    return gulp.src(['./main/index.js', './main/api/**/!(*.spec).js'], { base: './main' })
      .pipe(changed('./target/build/'))
      .pipe(gulp.dest('./target/build/'));
  });

  gulp.task('build-sass', function () {
    return gulp.src(['./main/web/style.scss'])
      .pipe(changed('./target/build/web/'))
      .pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
      }))
      .pipe(gulp.dest('./target/build/web/'));
  });

  gulp.task('build-app', function () {

    var source = [
      './main/web/app/**/*.module.js',
      './main/web/app/**/*.!(module|test|spec).js'
    ];

    return gulp.src(source)
      .pipe(changed('./target/build/web/app/'))
      .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./target/build/web/app/'));

  });

  gulp.task('run', ['build'], function () {

    var config = require('./target/build/api/config'),
      restarted = false;

    nodemon({
      script: './target/build/index.js',
      watch: [
        path.join(__dirname, 'target/build/index.js'),
        path.join(__dirname, '/target/build/api/**/*.js')
      ]
    })
    .on('start', delay(start, 1000))
    .on('restart', restart);

    function delay(fn, ms) {
      return function () {
        setTimeout(fn, ms);
      };
    }

    function start() {

      if (!restarted) {

        gulp.watch(['./main/index.js', './main/api/**/*.js'], ['test', 'build-api']);
        gulp.watch('./main/web/style.scss', ['build-sass']);
        gulp.watch(['./main/web/**/*.{html,ico,png,jpg,jpeg,gif}'], ['build-web']);
        gulp.watch(['./main/web/app/**/*.js'], ['build-app']);

      }

      if (util.env.browserSync) {

        if (restarted) {
          reload();
        } else {

          util.log('--browserSync is set');
          browserSync({
            proxy: 'localhost:' + config.httpPort + '/',
            port: 8080
          });
          gulp.watch([
            './target/build/web/**/*'
          ], reload);

        }

      } else {
        util.log('--browserSync is not set');
      }

    }

    function restart() {

      restarted = true;

    }

  });

  gulp.task('clear', function (cb) {
    del(['./target/build'], cb);
  });

  gulp.task('default', ['build']);

})();
