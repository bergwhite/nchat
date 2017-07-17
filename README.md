# NodeJS & SocketIO & Express & EJS & MongoDB & ES6 & Less & Gulp 打造多人在线聊天室

> 项目背景

这个项目主要是为了玩玩NodeJS，项目的方向大概是做出类似QQ的在线聊天系统。

项目使用PM2进行部署和管理，功能在不断的迭代开发中。如果你觉得这个项目比较有趣，或者能对你有所帮助，欢迎给个Star。

PS: 最近找工作，北京的欢迎联系。另外之前做过一个[基于Vue全家桶二次开发的V2EX社区](https://github.com/bergwhite/v2ex-vue)。

> 项目链接

* 第三版 源码 | 演示 | 图片 （定位移动端，提供REST API接口，预计2017/7/17发布）

* 第二版 [源码](https://github.com/bergwhite/nodejs-chat2) | [演示](http://47.93.252.247:8088/) | 图片 （定位PC端）

* 第一版 [源码](https://github.com/bergwhite/nodejs-chat1) | [演示](http://47.93.252.247:8082/) | [图片](DEMO.md) （只做基本维护）

* 测试版 源码 | 演示 | 图片

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
  - × 界面换肤

* 开发
  - √ 模块化
  - × 前后端分离
  - × 代码规范
  - × 测试用例

> 踩坑

跨域调用图灵机器人API

```

var proxy = require('http-proxy-middleware');

app.use('/api/robot', proxy({
  target: 'http://www.tuling123.com',
  changeOrigin: true
}));

```

> 前端路由

```

类型    状态    地址

首页    √       /        
房间    √       /room/:id
用户    √       /user/:id
注册    √       /register
登陆    √       /login   

```

> 后端接口

```

用户

接口       状态   请求   地址                 必须    参数

用户注册   √      POST   /api/user/register   无      {name: String, pass: String}
用户登陆   √      POST   /api/user/login      无      {name: String, pass: String}
注销登陆   √      POST   /api/user/logout     已登录  空
删除用户   ×      DELETE /api/user/del        已登录  {passOld: String}
用户资料   √      GET    /api/user/info/:id   无      空
用户列表   √      GET    /api/user            无      空
修改密码   √      PUT    /api/user/pass       已登录  {passOld: String, passNew: String}
修改资料   √      PUT    /api/user/info       已登录  {gender: String, img: String, city: String, hobbies: String}
上传头像   ×      POST   /api/user/img        已登录  {img: String}

房间

接口       状态   请求  地址                 必须    参数

添加房间   √      POST  /api/room/add        已登录  {name: String, desc: String}
房间描述   √      GET   /api/room/info/:id   无      空
聊天记录   √      GET   /api/room/mess/:id   无      空
房间列表   √      GET   /api/room            无      空

```

> 数据库

```

infos

{
  user: String,
  gender: String,
  img: String,
  city: String,
  hobbies: Array
}

messes

{
  room: String,
  user: String,
  mess: String,
  time: Number,
  img: String
}

rooms

{
  name: String,
  desc: String
}

users

{
  name: String,
  pass: String
}

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
npm run start // 开启聊天室（在线部署）

```