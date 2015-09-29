module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon-chai'],
    preprocessors: {
      './~public/**/*.html': ['ng-html2js'],
      './modules/**/web/**/*.js': ['coverage'],
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: '~public',
      moduleName: "karma.templates"
    },
    files: [
      './bower_components/jquery/dist/jquery.js',
      './bower_components/angular/angular.js',
      './bower_components/angular-ui-router/release/angular-ui-router.js',
      './bower_components/angular-mocks/angular-mocks.js',
      './bower_components/angular-animate/angular-animate.js',
      './bower_components/angular-aria/angular-aria.js',
      './bower_components/angular-jwt/dist/angular-jwt.js',
      './bower_components/a0-angular-storage/dist/angular-storage.js',
      './bower_components/angular-sanitize/angular-sanitize.js',
      './modules/**/web/**/index.js',
      './modules/**/web/**/!(index)*!(.spec).js',
      './~public/**/*.html'
    ],
    basePath: '../',
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
    reporters: ['coverage'],
    coverageReporter: {
      type : 'json',
      dir : 'coverage/web/'
    },
  });
  
}
