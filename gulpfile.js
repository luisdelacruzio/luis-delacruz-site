var gulp        = require('gulp');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header      = require('gulp-header');
var cleanCSS    = require('gulp-clean-css');
var rename      = require("gulp-rename");
var uglify      = require('gulp-uglify');
var filter      = require('gulp-filter');
var pkg         = require('./package.json');
var svgmin      = require('gulp-svgmin');
var htmlmin     = require('gulp-htmlmin');
var concat = require('gulp-concat');

// Set the banner content
var banner = ['/*!\n',
  ' * Luis Delacruz Site\n',
  ' */\n',
  ''
].join('');

// Compiles SCSS files from /scss into /css
gulp.task('sass', function() {
  return gulp.src('scss/freelancer.scss')
    .pipe(sass())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
  return gulp.src('css/all.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('concat-scripts', function() {
  return gulp.src([
    'vendor/jquery/jquery.min.js',
    'vendor/popper/popper.min.js',
    'vendor/bootstrap/js/bootstrap.min.js',
    'vendor/jquery-easing/jquery.easing.min.js',
    'js/src/jqBootstrapValidation.js',
    'js/src/contact_me.js',
    // 'plugins/github-activity/dist/github-activity-0.1.5.min.js',
    // 'js/gh-activity-init.js',
    'js/src/freelancer.min.js',
    'plugins/jquery.lazy/jquery.lazy.min.js'
  ])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./js'))
});

gulp.task('concat-styles', function() {
  return gulp.src([
    'vendor/bootstrap/css/bootstrap.min.css',
    'vendor/font-awesome/css/font-awesome.min.css',
    'css/freelancer.css',
    'plugins/devicon/devicon.min.css'

  ])
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./css'))
});

// Minify custom JS
gulp.task('minify-js', function() {
  return gulp.src('js/all.js')
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.reload({
      stream: true
    }))

});

gulp.task('minify-svg', function () {
    return gulp.src('./img/svg/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./img/svg/'))
        .pipe(browserSync.reload({
          stream: true
        }))
});

gulp.task('minify-html', function() {
  return gulp.src('./html/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task('copy', function() {
  gulp.src([
      'node_modules/bootstrap/dist/**/*',
      '!**/npm.js',
      '!**/bootstrap-theme.*',
      '!**/*.map'
    ])
    .pipe(gulp.dest('vendor/bootstrap'))

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('vendor/jquery'))

  gulp.src(['node_modules/popper.js/dist/umd/popper.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
    .pipe(gulp.dest('vendor/popper'))

  gulp.src(['node_modules/jquery.easing/*.js'])
    .pipe(gulp.dest('vendor/jquery-easing'))

  gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    .pipe(gulp.dest('vendor/font-awesome'))
})

// Default task
gulp.task('default', ['sass', 'minify-css', 'minify-js', 'minify-svg', 'minify-html', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'minify-html','concat-styles', 'minify-css','concat-scripts', 'minify-js'], function() {
  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('css/*.css', ['concat-styles','minify-css']);
  gulp.watch('js/src/*.js', ['concat-scripts','minify-js']);
  gulp.watch('html/*.html',['minify-html']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('js/*.js', browserSync.reload);
});
