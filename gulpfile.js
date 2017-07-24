const gulp = require('gulp'),
      lessToCSS = require('gulp-less'),
      minifyCSS = require('gulp-clean-css'),
      minifyJS = require('gulp-uglifyjs'),
      babel = require('gulp-babel'),
      rename = require('gulp-rename');

// 配置信息
// 文件所在目录和输出目录
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

// 打包任务
// 打包成一个CSS并压缩
gulp.task('compile-css', () => {
  return gulp.src(compileDir.css.src)
          .pipe(lessToCSS())
          .pipe(minifyCSS())
          .pipe(rename((path) => {
            path.basename += '.min'
          }))
          .pipe(gulp.dest(compileDir.css.dest))
});

// 打包任务
// 逐个文件ES6转ES5并压缩
gulp.task('compile-js', () => {
  const JSTaskList = ['index', 'login', 'mobile', 'room', 'roomAdd', 'userInfoMod', 'roomMember']
  return JSTaskList.map((e) => {
    gulp.src(`${compileDir.js.src}${e}.js`)
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(minifyJS())
      .pipe(rename((path) => {
        path.basename += '.min'
      }))
      .pipe(gulp.dest(compileDir.js.dest))
  })
});

// 构建任务
// 构建线上代码
gulp.task('build', ['compile-css', 'compile-js'])