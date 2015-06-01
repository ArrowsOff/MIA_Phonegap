var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var concat = require('gulp-concat');

var paths = {
  sass: ['./app/scss/**/*.scss'],
  html: ['./app/**/*.html'],
  scripts: ['./app/js/**/*.js'],
  images: ['/./app/img/**/*'],
  libraries: ['./app/lib/ionic/js/ionic.bundle.js', 
              './app/lib/ng-lodash/build/ng-lodash.js',
              './app/lib/ng-resource/dist/ng-resource.js',
              './app/lib/localforage/dist/localForage.js',
              './app/lib/angular-localforage/dist/angular-localForage.js'],
  fonts: ['./app/lib/ionic/fonts/**',
          './app/lib/materialize/font/**/*']
};

gulp.task('default', ['sass', 'html', 'scripts', 'scripts:vendor', 'images', 'data']);

/* HTML Function
*********************************/
gulp.task('html', function() {
  gulp.src('./app/templates/**/*.html')
    .pipe(gulp.dest('./www/templates/'))

  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./www'))
});

/* Fonts Function
*********************************/
gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('./www/fonts/'))
});

/* Scripts Function
*********************************/
gulp.task('scripts', function() {
  return gulp.src('./app/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./www'))
});

gulp.task('scripts:vendor', function(){
  return gulp.src(paths.libraries)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./www'))
})

/* Images Function
*********************************/
gulp.task('images', function() {
  return gulp.src('./app/img/**/*')
    .pipe(gulp.dest('./www/img'))
});

/* Data Function
*********************************/
gulp.task('data', function() {
  return gulp.src('./app/data/**/*')
    .pipe(gulp.dest('./www/data'))
});

/* Styles Function
*********************************/
gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gulp.dest('./www/css/'))
});


/* Watch Function
*********************************/
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
