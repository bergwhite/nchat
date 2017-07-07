# NodeJS & SocketIO & Express & EJS & MongoDB & Gulp 打造多人在线聊天室

> 项目背景

这个项目主要是为了玩玩NodeJS，项目的方向大概是做出类似QQ的在线聊天系统。

项目使用PM2进行部署和管理，功能在不断的迭代开发中。如果你觉得这个项目比较有趣，或者能对你有所帮助，欢迎给个Star。

PS: 最近找工作，北京的欢迎联系。另外之前做过一个[基于Vue全家桶二次开发的V2EX社区](https://github.com/bergwhite/v2ex-vue)。

[最新版本在线演示](http://47.93.252.247:8088/) | 最新版本图片演示 | [历史版本图片演示](DEMO.md)

> 功能

* 聊天
  - √ 群聊
  - × 私聊
  - √ 表情
  - × 斗图
  - × 更多表情

* 用户
  - √ 在线清单
  - √ 随机头像
  - √ 上线通知
  - √ 离线通知
  - √ 消息推送
  - × 上传头像
  - × 在线统计
  - × 随机昵称

* 房间
  - √ 房间列表
  - × 添加房间
  - × 搜索房间

> 优化

* 基础
  - √ 代码压缩

* 展示
  - √ 以前未设置头像的，显示默认头像
  - × 加载速度优化

* 开发
  - √ 模块化
  - × 前后端分离
  - × 代码规范
  - × 测试用例

> 踩坑

暂时没有很特别的坑...

> 前端路由

```

√  /                   // 首页
√  /room/:id           // 房间
×  /user/:id           // 用户

```

> 后端接口

```

×  GET   /api/user               // 用户列表
×  POST  /api/user/add           // 注册
×  POST  /api/user/login         // 登陆
×  POST  /api/user/logout        // 注销
×  POST  /api/user/del           // 删除
×  POST  /api/user/:id/nick      // 修改昵称
×  POST  /api/user/:id/pass      // 修改密码
√  GET   /api/user/:id/info      // 获取资料
×  POST  /api/user/:id/info      // 修改资料
×  GET   /api/room               // 获取房间列表
×  GET   /api/room/add           // 添加房间
×  GET   /api/room/:id           // 获取房间信息
×  GET   /api/room/:id/mess      // 获取房间记录

```

> 目录

```

├─bin
│    www  // 启动express
│    database  // MongoDB
│        index.js
│        info.js
│        mess.js
│        room.js
│        user.js
│    socket  // socket服务（关键文件）
│        index.js
│        event.js
│        data.js
│        method.js
│        io.js
├─public  // 静态文件
│    css
│        index.css  // 首页CSS
│        index.min.css  // 压缩后的代码
│    js
│        index.js  // 与socket服务进行通讯（关键文件）
│        index.min.js  // 压缩后的代码
├─routers
│    index.js  // 页面路由
│    basic.js  // 公共配置
│    home.js  // 首页
│    room.js  // 房间
│    user.js  // 用户
├─view
│    error.ejs  // 错误页
│    index.ejs  // 首页
│    userCenter.ejs  // 用户中心
│    userInfo.ejs  // 用户信息
│    userList.ejs  // 用户列表
│    userLogin.ejs  // 登陆
│    userRegister.ejs  // 注册
├─app.js  // express
├─gulpfile.js  // gulp
├─package.json

```

> 安装



启动项目以前，请确保已经安装mongodb，并在package.json中修改MongoDB的安装路径（--dbpath）。

[Windows安装教程](https://jockchou.gitbooks.io/getting-started-with-mongodb/content/book/install.html) | Linux安装教程

```

git clone https://github.com/bergwhite/nodejs-chat  // 克隆项目
cd nodejs-chat  // 进入目录
npm install  // 安装依赖
npm run build  // 构建代码
npm run mongod // 开启MongoDB
npm run start // 开启聊天室

```