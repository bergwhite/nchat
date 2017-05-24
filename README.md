# NodeJS & SocketIO & Express & EJS & MongoDB 打造多人在线聊天室

> 项目背景

这个项目是为了玩玩NodeJS，越玩越觉着有趣了。主要是，有挑战性。如果你对这个项目有更有趣的玩法，欢迎联系我或提交issue。 [在线演示](http://47.93.252.247:8088/)

项目使用PM2进行部署和管理（这个npm包很给力）。

PS: 喜欢的欢迎给个Star。最近找工作，北京的欢迎联系。

> 项目演示

用户注册

![nodejs-chat-user-reg](http://atmp.oss-cn-qingdao.aliyuncs.com/img/nodejs-chat-user-reg.gif)

发送消息

![nodejs-chat-msg-send](http://atmp.oss-cn-qingdao.aliyuncs.com/img/nodejs-chat-msg-send.gif)

房间消息独立

![nodejs-chat-multi-room](http://atmp.oss-cn-qingdao.aliyuncs.com/img/nodejs-chat-multi-room.gif)

> 项目目录

```

├─bin
│    www  // 启动express
├─database
│    index.js  // MongoDB
├─public  // 静态文件
│    css
│        index.css  // 首页CSS
│    js
│        index.js  // 与socket服务进行通讯（关键文件）
|        socket-server.js  // socket服务（关键文件）
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

> 已上线功能

* 跨浏览器，跨地域聊天（SocketIO自带技能）
* 首次进入会显示欢迎信息
* 直接发送消息默认昵称为“神秘人”
* 发送后会清空当前输入框内容
* 添加用户名后会成为新用户，此时会告知全房间人有新用户加入
* 创建不同的房间，不同的房间的聊天是相互独立的
* 显示当前房间的在线用户（设置了用户名的）
* ...

> 待上线功能

用户名

* 统计匿名用户
* 支持一键随机获取用户名

头像

* 访客使用默认头像
* 新用户（设置了用户名的）随机获得一个头像
* 新用户换头像可以从默认的一组头像中选择
* 是否支持上传头像还在考虑中（安全性问题）

聊天

* 支持多组丰富的表情包
* 是否支持上传图片还在考虑中（安全性问题）

数据库

* 对接MongoDB，新用户（设置了用户名的）设置密码后，将从临时用户

> 项目缺陷

* 界面丑（等功能完善了再考虑）
* ...

> 开始安装

使用之前，请在package.json中修改MongoDB的安装路径（--dbpath）。

```

git clone https://github.com/bergwhite/nodejs-chat  // 克隆项目到本地
cd nodejs-chat  // 进入项目目录
npm install  // 安装依赖
npm run mongod // 启动MongoDB服务
npm run start // 启动聊天室服务并启动网站

```