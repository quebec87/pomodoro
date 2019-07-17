const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-minify');

gulp.task('browser-sync', () => {
  browserSync.init({
    server: './public/',
  });
});

// Compile Sass & Inject Into Browser
gulp.task('sass', () => gulp.src(['src/sass/**/*.scss'])
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded',
    indentType: 'tab',
    indentWidth: '1',
  }).on('error', sass.logError))
  .pipe(postcss([
    autoprefixer({
      browsers: ['last 2 version'],
    }),
  ]))
  .pipe(sourcemaps.write(''))
  .pipe(gulp.dest('public/css'))
  .pipe(browserSync.stream()));

// minify js
gulp.task('compress', () => {
  gulp.src(['src/main.js'])
    .pipe(minify())
    .pipe(gulp.dest('public/'));
});

// Watch Sass & Serve
gulp.task('watch', [], () => {
  gulp.watch(['src/sass/**/*.scss'], ['sass']);
  gulp.watch(['src/*.js'], ['compress']);
  gulp.watch('public/*.html').on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['browser-sync', 'sass', 'compress', 'watch']);
