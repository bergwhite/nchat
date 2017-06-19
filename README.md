# NodeJS & SocketIO & Express & EJS & MongoDB & Gulp 打造多人在线聊天室

> 项目背景

这个项目主要是为了玩玩NodeJS，项目的方向大概是做出类似QQ的在线聊天系统。想要在线体验可以点击[在线演示](http://47.93.252.247:8088/)。

项目使用PM2进行部署和管理，功能在不断的迭代开发中。如果你觉得这个项目比较有趣，或者能对你有所帮助，欢迎给个Star。

PS: 最近找工作，北京的欢迎联系。另外之前做过一个[基于Vue全家桶二次开发的V2EX社区](https://github.com/bergwhite/v2ex-vue)。

> 项目目录

```

├─bin
│    www  // 启动express
|    socket-server.js  // socket服务（关键文件）
├─database
│    index.js  // MongoDB
├─public  // 静态文件
│    css
│        index.css  // 首页CSS
│    js
│        index.js  // 与socket服务进行通讯（关键文件）
│    img
├─routers
│    index.js  // 页面路由
├─view
│    error.ejs  // 错误页
│    index.ejs  // 首页
│    userCenter.ejs  // 用户中心（规划中）
│    userList.ejs  // 用户列表（规划中）
├─app.js  // express
├─package.json  // npm包

```

> 路由

目前只有/目录和/room/:id正式使用了，其他路由的页面还在迭代开发中。

```

/  // 首页
/user  // 用户列表
/user/:id  // 用户中心
/user/:id/register  // 注册（JSON）
/user/:id/login  // 登陆（JSON）
/user/:id/logout  // 注销（JSON）
/user/:id/info  // 用户资料（JSON）
/room/:id  // 指定聊天室

```

> 开始安装

使用之前，请在package.json中修改MongoDB的安装路径（--dbpath）。

```

git clone https://github.com/bergwhite/nodejs-chat  // 克隆项目到本地
cd nodejs-chat  // 进入项目目录
npm install  // 安装依赖
npm run build  // 构建线上代码
npm run mongod // 启动MongoDB服务
npm run start // 启动聊天室服务并启动网站

```

> 项目演示

匿名聊天

![nodejs-chat-nick-chat](http://atmp.oss-cn-qingdao.aliyuncs.com/img/nodejs-chat-nick-chat.gif)

用户聊天

![nodejs-chat-user-chat](http://atmp.oss-cn-qingdao.aliyuncs.com/img/nodejs-chat-user-chat.gif)

成员&房间

![nodejs-chat-memb-room](http://atmp.oss-cn-qingdao.aliyuncs.com/img/nodejs-chat-memb-room.gif)

离线通知

![nodejs-chat-user-gone](http://atmp.oss-cn-qingdao.aliyuncs.com/img/nodejs-chat-user-gone.gif)

更多房间

![nodejs-chat-more-rooms](http://atmp.oss-cn-qingdao.aliyuncs.com/img/nodejs-chat-more-rooms.gif)

房间独立

![nodejs-chat-room-diff](http://atmp.oss-cn-qingdao.aliyuncs.com/img/nodejs-chat-room-diff.gif)

> 已上线功能

* 跨浏览器，跨地域聊天（SocketIO自带技能）
* 首次进入会显示欢迎信息
* 发送空消息会进行提示
* 直接发送消息默认昵称为“神秘人”
* 发送消息后会清空当前输入框内容，然后焦点回到消息输入框
* 支持发送表情包
* 添加用户名后会成为新用户，然后告知全房间人有新用户加入
* 发送完消息，自动滚动到最新内容
* 可以创建不同的房间，不同的房间的聊天是相互独立的
* 显示当前房间的在线用户（设置了用户名的）
* 显示目前所有打开的房间
* 用户（设置了用户名的）离线会通知所有房间内的成员
* 压缩线上代码，加快访问速度
* 支持获取随机头像
* 支持房间切换
* ...

> 待上线功能

用户名

* 统计匿名用户
* 支持一键随机获取用户名

头像

* 是否支持上传头像还在考虑中（安全性问题）

聊天

* 支持多组丰富的表情包
* 是否支持上传图片还在考虑中（安全性问题）

数据库

* 对接MongoDB，新用户（设置了用户名的）设置密码后，将从临时用户转变为正式用户

> 项目缺陷

* 界面丑（等功能完善了再考虑）
* ...