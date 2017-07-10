const gulp = require('gulp'),
      lessToCSS = require('gulp-less'),
      minifyCSS = require('gulp-clean-css'),
      minifyJS = require('gulp-uglifyjs'),
      babel = require('gulp-babel'),
      rename = require('gulp-rename');
const compileDir = {
  css: {
    src: 'public/css/index.css',
    dest: 'public/css'
  },
  js: {
    src: 'public/js/index.js',
    dest: 'public/js'
  }
};
// 编译CSS
gulp.task('compile-css', () => {
  return gulp.src(compileDir.css.src)
        .pipe(lessToCSS())
        .pipe(minifyCSS())
        .pipe(rename(function(path) {
          path.basename += '.min'
        }))
        .pipe(gulp.dest(compileDir.css.dest))
});
// 编译JS
gulp.task('compile-js', () => {
  return gulp.src(compileDir.js.src)
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(minifyJS())
        .pipe(rename(function(path) {
          path.basename += '.min'
        }))
        .pipe(gulp.dest(compileDir.js.dest))
});
gulp.task('build', ['compile-css', 'compile-js'])