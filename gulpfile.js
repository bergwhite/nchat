const gulp = require('gulp'),
      lessToCSS = require('gulp-less'),
      minifyCSS = require('gulp-clean-css'),
      minifyJS = require('gulp-uglifyjs'),
      babel = require('gulp-babel'),
      rename = require('gulp-rename');

// JS和CSS的输入文件和输出文件
const compileDir = {
  css: {
    src: 'public/src/css/index.less',
    dest: 'public/dist/css'
  },
  js: {
    src: 'public/src/js/',
    dest: 'public/dist/js'
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
  const JSTaskList = ['index', 'login', 'mobile', 'room', 'roomAdd', 'userInfoMod', 'roomMember']
  return JSTaskList.map((e) => {
    gulp.src(`${compileDir.js.src}${e}.js`)
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(minifyJS())
      .pipe(rename(function(path) {
        path.basename += '.min'
      }))
      .pipe(gulp.dest(compileDir.js.dest))
  })
});

// 监听文件改变，自动编译
gulp.task('watch', ()=> {
  gulp.watch(`compileDir.css.src`, ['compile-css'])
  gulp.watch(`${compileDir.js.src}*.js`, ['compile-js'])
})

// 一键构建线上代码
gulp.task('build', ['compile-css', 'compile-js'])