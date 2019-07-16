const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

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


// Watch Sass & Serve
gulp.task('watch', [], () => {
  gulp.watch(['src/sass/**/*.scss'], ['sass']);
  gulp.watch('public/*.html').on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['browser-sync', 'sass', 'watch']);
