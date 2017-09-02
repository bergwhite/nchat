# 全栈式的开发多人在线聊天室

* 3.1.0 / 项目已从Session认证改为Token认证，更好的支持跨域用户认证。
* 3.1.1 / 修复PC页面访问的重定向问题。

> 技术栈

觉得好的欢迎点个star ^_^。

* 前端：Express & EJS & ES6 & Less & Gulp
* 后端：Express & SocketIO & MongoDB & [REST API](API.md) & Token
* 部署：Linux & PM2

> 演示

![NChat-qrcode](http://nchat.oss-cn-beijing.aliyuncs.com/img/NChat-qrcode3.1.png)

* 全栈式的开发多人在线聊天室
	* 项目只适配了移动端，请使用浏览器的手机视图查看。
  * 项目源码：[https://github.com/bergwhite/nchat](https://github.com/bergwhite/nchat)
  * 在线演示：[http://y.bw2.me:8086](http://y.bw2.me:8086)

> 目录

```

├─bin
│    www       // 后端 服务器
│    database  // 后端 数据库
│    socket    // 后端 socket
|    router    // 后端 路由
├─sessions     // 后端 session
├─public
│    src       // 前端 开发目录
│    dist      // 前端 线上目录
├─routes       // 前端 路由
├─view         // 前端 页面
├─app.js       // 前端 服务器
├─gulpfile.js  // 前端 Gulp
├─package.json

```

> 安装

* 项目基于MIT协议开源
* 启动项目以前，请确保已经安装mongodb，并在package.json中修改MongoDB的安装路径（--dbpath）

[Windows安装教程](https://jockchou.gitbooks.io/getting-started-with-mongodb/content/book/install.html) | Linux安装教程

```

git clone https://github.com/bergwhite/nodejs-chat  // 克隆项目
cd nodejs-chat  // 进入目录
npm install  // 安装依赖
npm run build  // 构建 线上代码
npm run mongod // 开启 数据库
npm run start // 开启 聊天室

```

> 功能

* 聊天
  - √ 群聊
  - × 私聊
  - √ 表情
  - × 斗图
  - × 更多表情
  - √ 聊天机器人（图灵）

* 用户
  - √ 在线清单
  - √ 随机头像
  - √ 上线通知
  - √ 离线通知
  - √ 消息推送
  - × 上传头像
  - √ 在线统计

* 房间
  - √ 房间列表
  - √ 添加房间
  - × 搜索房间

> 优化

* 基础
  - √ 代码压缩

* 展示
  - √ 以前未设置头像的，显示默认头像
  - √ 加载速度优化
  - × 界面换肤

* 开发
  - √ 组件化开发
  - √ 模块化开发
  - √ [REST API](API.md)
  - √ 使用PM2部署
  - √ 前后端分离
  - × 代码规范
  - × 测试用例

* 安全
  - √ 密码使用MD5+SALT保存
  - √ 聊天内容过滤`< >`等特殊标签

* 认证
  - √ Session

* 部署

  - Linux & PM2

> 踩坑

图灵机器人不支持跨域，通过代理中间件把请求代理到本地。

```

var proxy = require('http-proxy-middleware');

app.use('/api/robot', proxy({
  target: 'http://www.tuling123.com',
  changeOrigin: true
}));

```

Gulp使用通配符对多个文件处理，会压缩到一个文件中。以下是分别进行压缩的方式。

```

const gulp = require('gulp'),
      minifyJS = require('gulp-uglifyjs'),
      babel = require('gulp-babel'),
      rename = require('gulp-rename');

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

```

gulp-uglifyjs - No files given; aborting minification

```

之前删除了一个JS文件，但是没有删除JSTaskList中的对应值。编译时会报上面的错误。删除对应的值就编译成功了。

```